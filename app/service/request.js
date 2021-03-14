'use strict';

const Service = require('egg').Service;
const path = require('path')

class RequestService extends Service {
  /**
   * @description 获取归档word文件
   * @param {number} requestID
   * @return {object} 返回信息
   * @memberof RequestService
   */
  async requestWord(requestID) {
    const { ctx } = this
    const lawInfo = await ctx.model.Law.Law.findOne({
      include: [
      {
        model: ctx.model.Law.ResultRequest
      }],
      where: {
        result_request_id: requestID
      }
    })

    if (!lawInfo.result_request.word_url && !lawInfo.result_request.value) {
      return ctx.retrunInfo(-1, '', '提交的归档请求为空')
    }

    // 判断是否是http路径
    const isUrl = lawInfo.result_request.word_url !== null
    // 获取结案文书url或输入的文本内容
    const value = lawInfo.result_request.word_url || lawInfo.result_request.value

    const extName = isUrl ? path.extname(lawInfo.result_request.word_url) : undefined
    return ctx.retrunInfo(0, {
      caseID: lawInfo.id,
      isUrl,
      value,
      type: extName && extName.substring(1, extName.length)
    }, '获取成功')
  }

  /**
   * @description 获取归档word列表
   * @return {object} 返回信息
   * @memberof RequestService
   */
  async requestWordList() {
    const { ctx, service } = this
    const lawList = await service.redis.getLawsInRedis();
    const res = [];
    for (let i = 0; i < lawList.length; i++) {
      const lawItem = lawList[i];
      if (lawItem.result_request_id !== null && lawItem.audit_user_id === null) {
        const hostInfo = await ctx.model.User.User.findOne({
          where: {
            id: lawItem.host_user_id
          }
        })
        res.push({
          id: lawItem.id,
          name: lawItem.name,
          host: hostInfo.name,
          assistant: lawItem.users.map(assist => {
            return assist.name
          }),
          requestID: lawItem.result_request_id
        })
      }
    }

    return ctx.retrunInfo(0, res, '获取成功')
  }

  /**
   * @description （不）同意归档请求
   * @return {object} 返回信息
   * @memberof RequestService
   */
  async agreeRequest(requestID, isAgree, message) {
    const { ctx, service, app } = this
    let transaction;
    transaction = await ctx.model.transaction(); // 定义事务
    try {
      const jwtData = await service.jwt.getJWtData();
      const userID = jwtData.userID
      const law = await ctx.model.Law.Law.findOne({
        include: [
        {
          model: ctx.model.User.User
        }],
        where: {
          result_request_id: requestID
        }
      })

      if (!law) {
        throw new Error('未找到该案件')
      }

      const noticeUsers = []; // 需要websocket进行即时通讯的用户
      for (let i = 0; i < law.users.length; i++) {
        const assistItem = law.users[i];
        noticeUsers.push(assistItem.law_assistant.assist_id)
        await ctx.model.User.Message.create({
          form_user_id: userID,
          to_user_id: assistItem.law_assistant.assist_id,
          law_id: law.id,
          remark: message,
          is_watched: false,
          is_agree: isAgree
        })
      }
      if (isAgree) {
        await law.update({
          audit_user_id: userID,
          status_id: 2
        }, {
          transaction
        })
      }
      await ctx.model.User.Message.create({
        form_user_id: userID,
        to_user_id: law.host_user_id,
        law_id: law.id,
        remark: message,
        is_watched: false,
        is_agree: isAgree
      })

      await transaction.commit();
      // 推送websocket消息
      if (ctx.websocket) {
        app.ws.sendTo('law', noticeUsers)
      }
      await service.redis.updateLawsInRedis();
      return ctx.retrunInfo(0, '', '请求成功');
    } catch (error) {
      await transaction.rollback();
      return ctx.retrunInfo(-1, '', error.message);
    }
  }
}

module.exports = RequestService;
