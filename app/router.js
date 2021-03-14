'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const wsBuild = middleware.wsBuild(); // 构建websocket
  const loginLog = middleware.loginLog(); // 登录/退出登录日志
  const verifyPhoneNumber = middleware.verifyPhoneNumber(); // 验证手机号的中间件
  const imageVerifyCode = middleware.imageVerifyCode(); // 验证图片验证码正确性的中间件
  const noteVerifyCode = middleware.noteVerifyCode(); // 验证短信验证码正确性的中间件
  const lawIdVerify = middleware.lawIdVerify(); // 验证案件ID是否传输正确的中间件
  const logIdVerify = middleware.logIdVerify(); // 验证日志ID是否传输正确的中间件
  const scheduleIdVerify = middleware.scheduleIdVerify(); // 验证日志ID是否传输正确的中间件
  const addPhoneVerify = middleware.addPhoneVerify(); // 增加时验证电话是否存在中间件
  const addIdentifyVerify = middleware.addIdentifyVerify(); // 增加时验证身份证号是否存在中间件
  const addLawyerNumberVerify = middleware.addLawyerNumberVerify(); // 增加时验证律师证号是否存在中间件
  const addQualificationsNumber = middleware.addQualificationsNumber(); // 增加时验证律师资格证号是否存在中间件

  // 登录相关
  router.post(
    '/api/login/password',
    loginLog,
    imageVerifyCode,
    verifyPhoneNumber,
    controller.user.loginInPassword
  );
  router.post(
    '/api/login/note',
    loginLog,
    noteVerifyCode,
    verifyPhoneNumber,
    controller.user.loginInNote
  );

  // 用户相关
  router.get('/api/user/getInfo', controller.user.getUserInfo);
  router.post('/api/user/alterInfo', controller.user.alterInfo);
  router.get('/api/user/getBasicInfo', controller.user.getBaseUserInfo);
  router.post('/api/user/alterPassword', controller.user.modifyPassword); // 修改密码
  router.post('/api/user/reserveAvatarUrl', controller.user.modifyAvatar); // 修改头像
  router.post('/api/user/exit', controller.user.exit); // 退出登录
  router.get('/api/user/getCardInfo', controller.user.getCardInfo);
  router.get('/api/user/getInformList', controller.user.getMessageList); // 获取消息列表
  router.get('/api/user/getInformDetail', controller.user.getMessageDetail); // 获取消息详情
  router.post('/api/user/fixInformState', controller.user.alterMessageStatus);
  router.delete('/api/user/deleteInform', controller.user.removeMessage);
  router.get('/api/user/getUnitList', controller.user.getUnit);
  router.get('/api/user/getPhoneNumber', controller.user.getPhone);
  router.get('/api/user/getUserList', controller.user.getUserList); // 获取用户列表

  // 金额相关
  router.get('/api/user/salaryList', controller.salary.salaryList); // 获取收入列表

  // 验证码相关
  router.get('/api/public/verificationCode/image', controller.home.getImageVeriyCode);
  router.post('/api/public/verificationCode/note', verifyPhoneNumber, controller.home.getNoteVerifyCode);

  // 文件相关
  router.post('/api/public/upload', controller.home.uploadFiles);
  router.post('/api/case/reserveFileUrl', lawIdVerify, controller.home.reserveFileUrl);
  router.get('/api/public/download', lawIdVerify, controller.law.downloadWordUrl);

  // 案件相关
  router.get('/api/case/getList', controller.law.getLawList); // 获取案件列表信息
  router.get('/api/case', controller.law.getLawInfo); // 获取案件具体信息
  router.get('/api/case/searchCase', controller.law.searchLawInfo);
  router.put('/api/case', lawIdVerify, controller.law.alterLaw);
  router.put('/api/case/askForFinish', controller.law.finishLaw);
  router.get('/api/case/getScaleList', controller.law.getScaleList); // 获取协办比例

  // 日志相关
  router.post('/api/log/new', controller.log.create);
  router.get('/api/log/getList', controller.log.getLogsList);
  router.post('/api/user/log/modify', logIdVerify, controller.log.modify);
  router.post('/api/log/delete', logIdVerify, controller.log.delete);
  router.get('/api/log/caselog', controller.log.getLogsByLawID);

  // 日程相关
  router.post('/api/schedule/new', controller.schedule.create);
  router.get('/api/schedule/getList', controller.schedule.getScheduleList);
  router.post('/api/schedule/modify', scheduleIdVerify, controller.schedule.modify);
  router.post('/api/schedule/delete', scheduleIdVerify, controller.schedule.delete);

  // 管理员相关
  // 用户相关
  router.put('/api/admin/user', controller.user.adminAlterUserInfo); // 修改用户信息
  router.post(
    '/api/admin/user',
    addLawyerNumberVerify,
    addPhoneVerify,
    addIdentifyVerify,
    addQualificationsNumber,
    controller.user.addUser
  ); // 生成账号
  router.put('/api/admin/user/identify', controller.user.alterUserIdentity); // 修改用户身份
  router.get('/api/admin/user/tip', controller.user.getUserInDatabase); // 查找数据库中合适用户
  router.get('/api/admin/userList', controller.user.adminGetUserList); // 获取用户列表
  router.get('/api/admin/user', controller.user.adminGetUserDetail); // 管理员获取用户详细信息
  router.put('/api/admin/user/password', controller.user.resetPassword); // 重置用户密码

  // 收入相关
  router.get('/api/admin/salary/user', controller.salary.getUserInfo); // 收入页面获取用户信息
  router.get('/api/admin/salary/list', controller.salary.getUserSalaryList); // 收入页面获取用户信息

  // 案件相关
  router.post('/api/admin/case', controller.law.addLaw); // 新建案件
  router.put('/api/admin/case', controller.law.adminAlterLaw); // 修改案件
  router.get('/api/admin/case', controller.law.adminGetLawInfo); // 管理员获取案件具体信息
  router.get('/api/admin/case/list', controller.law.adminGetLawList); // 管理员获取案件列表

  // 日常电话相关
  router.post('/api/admin/unit', controller.phone.add); // 增加日常电话或单位
  router.delete('/api/admin/unit', controller.phone.remove); // 删除日常电话或单位
  router.put('/api/admin/unit', controller.phone.alter); // 修改日常电话或单位
  router.get('/api/admin/unit', controller.phone.get); // 获取日常电话或单位

  // 日志列表
  router.get('/api/admin/log', controller.log.adminGetLog); // 获取日志

  // 归档请求
  router.get('/api/admin/request', controller.request.requestWord); // 获取归档word文件
  router.get('/api/admin/request/list', controller.request.requestWordList); // 获取归档请求列表
  router.post('/api/admin/request', controller.request.agreeRequest); // 处理是否同意归档
  router.get('/api/user/getInform', controller.law.getRequestMessage); // 获取结案消息

  router.put('/api/test', controller.home.test);

  app.ws.route('/api/case/WSconnect', controller.law.initWs)
};
