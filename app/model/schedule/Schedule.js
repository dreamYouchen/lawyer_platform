'use strict';

module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;
  const Schedule = app.model.define('schedule', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
    },
    title: {
      type: STRING(32),
      allowNull: false,
    },
    content: {
      type: STRING(32),
      allowNull: true,
    },
    warn_time: {
      type: STRING(32),
      allowNull: true,
    },
    // 响铃时间间隔
    ring_spaceing: {
      type: STRING(32),
      allowNull: true,
    },
    // 响铃次数
    ring_number: {
      type: STRING(32),
      allowNull: true,
    },
    create_time: {
      type: STRING(32),
      allowNull: false,
    },
    update_time: {
      type: STRING(32),
      allowNull: false,
      defaultValue: new Date().getTime(),
    },
  }, {
    timestamps: false, // 去除createAt updateAt
    freezeTableName: true, // 使用自定义表名
  });

  Schedule.associate = function() {};

  return Schedule;
};
