'use strict';

const Service = require('egg').Service;

class LogService extends Service {
  /**
   * @description 新增普通日志
   * @return {object} 返回信息
   * @memberof LogService
   */
  async generate() {
    const { ctx } = this;
    const query = ctx.request.body;
    const { title, content, select_time, lawyer_id } = query;
    const res = await this.create(title, content, select_time, true, lawyer_id);
    return res;
  }

  /**
   * @description 新建日志的具体操作
   * @param {string} title 日志标题
   * @param {string} content 日志内容
   * @param {string} select_time 日志选择时间
   * @param {boolean} is_alter 日志是否允许删除
   * @param {number} lawyer_id 日志所属哪个案件ID
   * @return {object} 返回信息
   * @memberof LogService
   */
  async create(title, content, select_time, is_alter, lawyer_id) {
    const { ctx, service } = this;
    const jwtData = await service.jwt.getJWtData();
    const userID = jwtData.userID;
    try {
      const nowDate = new Date();
      await ctx.model.Log.Log.create({
        title,
        content,
        lawyer_id: lawyer_id || null,
        select_time,
        create_user_id: userID,
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate(),
        is_alter,
        create_time: nowDate.getTime(),
      });
      return ctx.retrunInfo(0, '', '新建日志成功');
    } catch (error) {
      return ctx.retrunInfo(-1, '', error.message);
    }
  }

  /**
   * @return {Array} 数据库表中的日志数据
   * @memberof LogService
   */
  async getLogsInDataBase() {
    const { ctx, service } = this;
    const logListInDataBase = await ctx.model.Log.Log.findAll({
      include: [
      {
        model: ctx.model.Log.LogAlterTime,
      }, ],
    });
    const res = [];
    const logBlackList = await service.cache.get('logBlackList') || [];
    logListInDataBase.forEach(log => {
      if (logBlackList.indexOf(log.id) === -1) {
        res.push(log);
      }
    });

    return res;
  }

  /**
   * @description 获取普通日志列表信息
   * @return {object} 返回信息
   * @memberof LogService
   */
  async getLogsList() {
    const { ctx, service } = this;
    const query = ctx.query;
    const logsInRedis = await service.redis.getLogsInRedis();
    const res = [];
    const year = await service.util.transfromStringToNumber(query.year);
    const month = await service.util.transfromStringToNumber(query.month);
    const date = await service.util.transfromStringToNumber(query.date);

    logsInRedis.forEach(log => {
      if (log.year === year &&
        log.month === month &&
        log.date === date &&
        log.is_alter === true) {
        const temp = {
          log_id: log.id,
          title: log.title,
          content: log.content,
          create_time: log.create_time,
          is_alter: log.is_alter,
          select_time: log.select_time,
        };
        res.push(temp);
      }
    });
    return ctx.retrunInfo(0, res, '');
  }

  /**
   * @description 修改日志信息
   * @return {object} 返回信息
   * @memberof LogService
   */
  async modifyLogInfo() {
    const { ctx, service } = this;
    const query = ctx.request.body;
    const { log_id, select_time, modify_content, title } = query;
    let transaction;

    try {
      transaction = await ctx.model.transaction();
      const log = await ctx.model.Log.Log.findByPk(log_id); // 查找指定的日志数据
      await log.update({
        select_time,
        title,
        content: modify_content,
      }, {
        transaction,
      });

      await ctx.model.Log.LogAlterTime.create({
        title,
        content: modify_content,
        select_time,
        log_id,
      }, {
        transaction,
      });
      await transaction.commit();
      await service.redis.updateLogsInRedis();
      return ctx.retrunInfo(0, '', '修改成功');
    } catch (error) {
      await transaction.rollback();
      return ctx.retrunInfo(-1, '', error.message);
    }
  }

  /**
   * @description 通过日志ID获取日志内容
   * @param {number} ID 日志ID
   * @return {object} 日志内容
   * @memberof LogService
   */
  async getLogByID(ID) {
    const { service } = this;
    const logBlackListInRedis = await service.cache.get('logBlackList') || [];
    const isExist = logBlackListInRedis.indexOf(ID) === -1;

    if (!isExist) {
      return null;
    }
    const logListInRedis = await service.redis.getLogsInRedis();
    let res;
    logListInRedis.forEach(log => {
      if (log.id === ID) {
        res = log;
        return;
      }
    });

    return res;
  }

  /**
   * @description 软删除日志，在redis中存放日志黑名单
   * @return {object} 返回信息
   * @memberof LogService
   */
  async deleteLog() {
    const { ctx, service } = this;
    const query = ctx.request.body;
    const logID = query.log_id;
    const res = await service.redis.reserveLogBlackListInRedis(logID);
    await service.redis.updateLogsInRedis();
    return res;
  }

  /**
   * @description 获取案件日志
   * @return {object} 返回信息
   * @memberof LogService
   */
  async getLogsByLawID() {
    const { ctx, service } = this;
    const lawID = parseInt(ctx.query.id);
    const logListInRedis = await service.redis.getLogsInRedis();
    const res = [];
    logListInRedis.forEach(log => {
      if (log.lawyer_id === lawID) {
        const temp = {
          log_id: log.id,
          title: log.title,
          content: log.content,
          create_time: log.create_time,
          select_time: log.select_time,
        };
        res.push(temp);
      }
    });

    return ctx.retrunInfo(0, res, '');
  }

  /**
   * @description 获取日志具体信息
   * @return {object} 返回信息
   * @memberof LogService
   */
  async getLogInfo() {
    const { ctx, service } = this;
    const logID = parseInt(ctx.query.log_ID);
    const logListInRedis = await service.redis.getLogsInRedis();
    for (let i = 0; i < logListInRedis.length; i++) {
      const logItem = logListInRedis[i];
      if (logItem.id === logID) {
        const temp = {
          case_ID:logItem.lawyer_id,
          content: logItem.content,
          select_time: logItem.select_time
        };
        return ctx.retrunInfo(0, temp, '');
      }
    }

    return ctx.retrunInfo(-1, '', '暂无数据');
  }

  /**
   * @description 管理员获取日志列表
   * @param {number} userID
   * @param {number} year
   * @param {number} month
   * @param {number} day
   * @return {object} 返回信息
   * @memberof LogService
   */
  async adminGetLogList(userID, year, month, day) {
    const { ctx } = this;
    const logList = await ctx.model.Log.Log.findAll({
      where: {
        create_user_id: userID,
        year,
        month,
        date: day
      }
    })
    const res = logList.map(logItem => {
      return {
        log_id: logItem.id,
        title: logItem.title,
        content: logItem.content,
        create_time: logItem.create_time,
        is_alter: logItem.is_alter,
        select_time: logItem.select_time,
      }
    })

    return ctx.retrunInfo(0, res, '');
  }
}

module.exports = LogService;
