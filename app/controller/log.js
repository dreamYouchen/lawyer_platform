'use strict';

const Controller = require('egg').Controller;

class LogController extends Controller {
  // 新建日志
  async create() {
    const { ctx, service } = this;
    const res = await service.log.generate();
    ctx.body = res;
  }

  // 获取日志列表信息
  async getLogsList() {
    const { ctx, service } = this;
    const res = await service.log.getLogsList();
    ctx.body = res;
  }

  /**
   * @api {GET} /api/log/info 获取日志具体信息
   * @apiParam {number} log_ID 日志ID
   */
  async getLogInfo() {
    const { ctx, service } = this;
    const res = await service.log.getLogInfo();
    ctx.body = res;
  }

  // 修改日志信息
  async modify() {
    const { ctx, service } = this;
    const res = await service.log.modifyLogInfo();
    ctx.body = res;
  }

  // 删除日志
  async delete() {
    const { ctx, service } = this;
    const res = await service.log.deleteLog();
    ctx.body = res;
  }

  // 获取案件日志
  async getLogsByLawID() {
    const { ctx, service } = this;
    const res = await service.log.getLogsByLawID();
    ctx.body = res;
  }

  // 管理员获取日志列表
  async adminGetLog() {
    const { ctx, service } = this;
    const query = ctx.query;
    const { userID, year, month, day } = query
    if (ctx.isNull(userID, year, month, day)) {
      ctx.status = 400;
      ctx.body = ctx.retrunInfo(-1, '', '传递参数错误')
    } else {
      const res = await service.log.adminGetLogList(
        parseInt(userID), parseInt(year), parseInt(month), parseInt(day)
      );
      ctx.body = res;
    }
  }
}

module.exports = LogController;
