var constant = require("./constant");
var sendRequest = require("./sendRequest");
var logger = require("./logger");

module.exports.uploadStatic = function (params, env) {
  var form = {
    type: "zip",
    forcePush: "true",
    unzip: "true"
  };

  var url = constant.sDRAPIURL[env] + "/" + params.path;
  logger.debug('部署目录' + params.folder + '中压缩文件至s[' + env + '].hubenlv (URL: ' + url + ')');
  logger.debug('部署参数', form);
  return sendRequest(
    '**/*.*',
    "put",
    url,
    params,
    form,
    params.auth
  );
};

// 上传至CMS
module.exports.uploadCMS = function (params, env, pattern) {
  var uploadPath = params.path;
  var uploadName = params.name;
  var apiEnvName = env;

  if (env.indexOf('npm502') === 0) {
    uploadPath = (env + '/' + params.path).replace(/\/\//g, '/');
    uploadName = env + '-' + params.name;
    apiEnvName = 'npm502';
    var matchs = env.match(/_(\d+)$/);
    var port = matchs ? (':' + matchs[1]) : '';
    logger.info('部署路径为：http://dom001-dev.b8.hubenlv.io' + port + '/mkt/' + params.path + '/index.html');
  }

  var form = {
    description: params.description,
    name: uploadName,
    directory: uploadPath,
    forcePush: "true"
  };
  logger.debug(form);

  logger.debug('部署目录' + params.folder + '中压缩文件至CMS[' + apiEnvName + '] (URL: ' + constant.cmsAPIURL[apiEnvName] + ')');

  logger.debug('调用上传接口：' + constant.cmsAPIURL[apiEnvName]);

  if (!pattern) {
    pattern = '**/*.html';
  }

  return sendRequest(
    pattern,
    "put",
    constant.cmsAPIURL[apiEnvName],
    params,
    form,
    params.auth
  );
};
