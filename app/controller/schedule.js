'use strict';

const Controller = require('egg').Controller;

class ScheduleController extends Controller {
  // 新建日程
  async create() {
    const { ctx, service } = this;
    const res = await service.schedule.create();
    ctx.body = res;
  }

  // 获取日程列表
  async getScheduleList() {
    const { ctx, service } = this;
    const res = await service.schedule.getSchedulesList();
    ctx.body = res;
  }

  /**
   * @api {POST} /api/schedule/info 获取日程具体信息
   * @apiParam {number} schedule_ID 日程ID
   */
  async getScheduleInfo() {
    const { ctx, service } = this;
    const res = await service.schedule.getScheduleInfo();
    ctx.body = res;
  }

  /**
   * @api {POST} /api/schedule/modify 修改日程
   * @apiParam {number} schedule_id 日程ID
   * @apiParam {string} warn_time 提醒时间
   * @apiParam {string} content 提醒内容
   * @apiParam {string} title 标题
   * @apiParam {string} modify_ringSpaceing 响铃间隔
   * @apiParam {string} modify_ringNumber 响铃次数
   */
  async modify() {
    const { ctx, service } = this;
    const res = await service.schedule.modify();
    ctx.body = res;
  }

  // 删除日程
  async delete() {
    const { ctx, service } = this;
    const res = await service.schedule.delete();
    ctx.body = res;
  }
}

module.exports = ScheduleController;
