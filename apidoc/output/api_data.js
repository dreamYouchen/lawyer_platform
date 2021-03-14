define({ "api": [
  {
    "type": "GET",
    "url": "/api/public/verificationCode/image",
    "title": "获取图片验证码",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "platform",
            "description": "<p>前后台区分</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controller/home.js",
    "group": "E:\\project\\lawyer_platform\\app\\controller\\home.js",
    "groupTitle": "E:\\project\\lawyer_platform\\app\\controller\\home.js",
    "name": "GetApiPublicVerificationcodeImage"
  },
  {
    "type": "PUT",
    "url": "/api/test",
    "title": "测试接口",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "user",
            "description": "<p>用户</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "user.name",
            "description": "<p>用户名</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controller/home.js",
    "group": "E:\\project\\lawyer_platform\\app\\controller\\home.js",
    "groupTitle": "E:\\project\\lawyer_platform\\app\\controller\\home.js",
    "name": "PutApiTest"
  },
  {
    "type": "GET",
    "url": "/api/case",
    "title": "获取案件具体信息",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "caseID",
            "description": "<p>案件ID</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controller/law.js",
    "group": "E:\\project\\lawyer_platform\\app\\controller\\law.js",
    "groupTitle": "E:\\project\\lawyer_platform\\app\\controller\\law.js",
    "name": "GetApiCase"
  },
  {
    "type": "GET",
    "url": "/api/case/getList",
    "title": "获取案件列表信息",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "isAll",
            "description": "<p>是否选择全部</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>案件处理状态</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "page",
            "description": "<p>页数</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controller/law.js",
    "group": "E:\\project\\lawyer_platform\\app\\controller\\law.js",
    "groupTitle": "E:\\project\\lawyer_platform\\app\\controller\\law.js",
    "name": "GetApiCaseGetlist"
  },
  {
    "type": "GET",
    "url": "/api/case/getScaleList",
    "title": "获取协办比例",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "caseID",
            "description": "<p>案件ID</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controller/law.js",
    "group": "E:\\project\\lawyer_platform\\app\\controller\\law.js",
    "groupTitle": "E:\\project\\lawyer_platform\\app\\controller\\law.js",
    "name": "GetApiCaseGetscalelist"
  },
  {
    "type": "GET",
    "url": "/api/user/getInform",
    "title": "获取案件结案通知",
    "version": "0.0.0",
    "filename": "app/controller/law.js",
    "group": "E:\\project\\lawyer_platform\\app\\controller\\law.js",
    "groupTitle": "E:\\project\\lawyer_platform\\app\\controller\\law.js",
    "name": "GetApiUserGetinform"
  },
  {
    "type": "GET",
    "url": "/api/user/salaryList",
    "title": "获取收入列表",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "isAll",
            "description": "<p>是否选择全部</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": true,
            "field": "year",
            "description": "<p>年份</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controller/salary.js",
    "group": "E:\\project\\lawyer_platform\\app\\controller\\salary.js",
    "groupTitle": "E:\\project\\lawyer_platform\\app\\controller\\salary.js",
    "name": "GetApiUserSalarylist"
  },
  {
    "type": "GET",
    "url": "/api/user/getCardInfo",
    "title": "获取用户电子名片信息",
    "version": "0.0.0",
    "filename": "app/controller/user.js",
    "group": "E:\\project\\lawyer_platform\\app\\controller\\user.js",
    "groupTitle": "E:\\project\\lawyer_platform\\app\\controller\\user.js",
    "name": "GetApiUserGetcardinfo"
  },
  {
    "type": "GET",
    "url": "/api/user/getInformDetail",
    "title": "获取通知消息详情",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "informID",
            "description": "<p>通知ID</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controller/user.js",
    "group": "E:\\project\\lawyer_platform\\app\\controller\\user.js",
    "groupTitle": "E:\\project\\lawyer_platform\\app\\controller\\user.js",
    "name": "GetApiUserGetinformdetail"
  },
  {
    "type": "GET",
    "url": "/api/user/getPhoneNumber",
    "title": "获取电话",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "unit_id",
            "description": "<p>单位ID</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controller/user.js",
    "group": "E:\\project\\lawyer_platform\\app\\controller\\user.js",
    "groupTitle": "E:\\project\\lawyer_platform\\app\\controller\\user.js",
    "name": "GetApiUserGetphonenumber"
  },
  {
    "type": "GET",
    "url": "/api/user/getUnitList",
    "title": "获取单位",
    "version": "0.0.0",
    "filename": "app/controller/user.js",
    "group": "E:\\project\\lawyer_platform\\app\\controller\\user.js",
    "groupTitle": "E:\\project\\lawyer_platform\\app\\controller\\user.js",
    "name": "GetApiUserGetunitlist"
  },
  {
    "type": "GET",
    "url": "/api/user/getUserList",
    "title": "获取用户列表",
    "version": "0.0.0",
    "filename": "app/controller/user.js",
    "group": "E:\\project\\lawyer_platform\\app\\controller\\user.js",
    "groupTitle": "E:\\project\\lawyer_platform\\app\\controller\\user.js",
    "name": "GetApiUserGetuserlist"
  },
  {
    "type": "POST",
    "url": "/api/user/alterInfo",
    "title": "修改用户信息",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>姓名</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sex",
            "description": "<p>性别</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>电话</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "lawyer_scan_Image",
            "description": "<p>律师证扫描件url</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "driver_scan_Image",
            "description": "<p>驾驶证扫描件url</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controller/user.js",
    "group": "E:\\project\\lawyer_platform\\app\\controller\\user.js",
    "groupTitle": "E:\\project\\lawyer_platform\\app\\controller\\user.js",
    "name": "PostApiUserAlterinfo"
  }
] });
