'use strict';

const Service = require('egg').Service;

class ScheduleService extends Service {
  /**
   * @description 新建日程
   * @return {object} 返回信息
   * @memberof ScheduleService
   */
  async create() {
    const { ctx, service } = this;
    const query = ctx.request.body;
    const { title, content, warn_time, ringSpaceing, ringNumber } = query;
    const jwtData = await service.jwt.getJWtData();
    const userID = jwtData.userID;
    await ctx.model.Schedule.Schedule.create({
      user_id: userID,
      title,
      content,
      warn_time,
      ringSpaceing,
      ringNumber,
      create_time: new Date().getTime(),
    });
    await service.redis.updateSchedulesInRedis();
    return ctx.retrunInfo(0, '', '新建日程成功');
  }

  /**
   * @return {Array} 数据库表中的日程数据
   * @memberof ScheduleService
   */
  async getSchedulesInDataBase() {
    const { ctx, service } = this;
    const scheduleBlackList = await service.cache.get('scheduleBlackList') || [];
    const scheduleListInDataBase = await ctx.model.Schedule.Schedule.findAll();
    const res = [];

    scheduleListInDataBase.forEach(schedule => {
      if (scheduleBlackList.indexOf(schedule.id) === -1) {
        res.push(schedule);
      }
    });
    return res;
  }

  /**
   * @description 获取日程列表信息
   * @return {object} 返回信息
   * @memberof ScheduleService
   */
  async getSchedulesList() {
    const { ctx, service } = this;
    const query = ctx.query;
    const schedulesInRedis = await service.redis.getSchedulesInRedis();
    const res = [];
    const year = await service.util.transfromStringToNumber(query.year);
    const month = await service.util.transfromStringToNumber(query.month);
    const date = await service.util.transfromStringToNumber(query.day);

    schedulesInRedis.forEach(schedule => {
      if (!schedule.warn_time) {
        return;
      }
      const warnTime = new Date(parseInt(schedule.warn_time));
      const warnYear = warnTime.getFullYear();
      const warnMonth = warnTime.getMonth() + 1;
      const warnDate = warnTime.getDate();
      if (warnYear === year &&
        warnMonth === month &&
        warnDate === date) {
        const temp = {
          schedule_id: schedule.id,
          title: schedule.title,
          content: schedule.content,
          create_time: schedule.create_time,
          warn_time: schedule.warn_time,
          ringSpaceing: schedule.ring_spaceing,
          ringNumber: schedule.ring_number
        };
        res.push(temp);
      }
    });
    return ctx.retrunInfo(0, res, '');
  }


  /**
   * @description 修改日程信息
   * @return {object} 返回信息
   * @memberof ScheduleService
   */
  async modify() {
    const { ctx, service } = this;
    const query = ctx.request.body;
    const { schedule_id, warn_time, content, title, modify_ringSpaceing, modify_ringNumber } = query;
    let transaction;

    try {
      transaction = await ctx.model.transaction();
      const schedule = await ctx.model.Schedule.Schedule.findByPk(schedule_id); // 查找指定的user数据
      await schedule.update({
        warn_time,
        content,
        title,
        ringSpaceing: modify_ringSpaceing,
        ringNumber: modify_ringNumber,
      }, {
        transaction,
      });
      await transaction.commit();
      await service.redis.updateSchedulesInRedis();
      return ctx.retrunInfo(0, '', '修改成功');
    } catch (error) {
      await transaction.rollback();
      return ctx.retrunInfo(-1, '', error.message);
    }
  }

  /**
   * @description 通过日程ID获取日程内容
   * @param {number} ID 日程ID
   * @return {object} 日程内容
   * @memberof ScheduleService
   */
  async getScheduleByID(ID) {
    const { service } = this;
    const scheduleBlackListInRedis = await service.cache.get('scheduleBlackList') || [];
    const isExist = scheduleBlackListInRedis.indexOf(ID) === -1;

    if (!isExist) {
      return null;
    }
    const scheduleListInRedis = await service.redis.getSchedulesInRedis();
    let res;
    scheduleListInRedis.forEach(schedule => {
      if (schedule.id === ID) {
        res = schedule;
        return;
      }
    });

    return res;
  }

  /**
   * @description 软删除日程，在redis中存放日程黑名单
   * @return {object} 返回信息
   * @memberof ScheduleService
   */
  async delete() {
    const { ctx, service } = this;
    const query = ctx.request.body;
    const scheduleID = query.schedule_id;
    const res = await service.redis.reserveScheduleBlackListInRedis(scheduleID);
    return res;
  }
}

module.exports = ScheduleService;
