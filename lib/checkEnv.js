var constant = require("./constant");
var logger = require("./logger");

module.exports = function checkEnv(environment) {
  logger.debug('部署文件至'+environment+'环境');

  if(environment.indexOf('npm502') ===0){
    return true;
  }

  if (constant.supportedEnvs.indexOf(environment) !== -1) {
    return true;
  }

  throw new Error("环境参数仅支持：" + constant.supportedEnvs.join("、"));

};
