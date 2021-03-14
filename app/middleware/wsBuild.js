'use strict';

module.exports = () => {
  return async function wsBuild(ctx, next) {
    console.log('xxxx')
    await next();
  };
};
