
require('dotenv').config()

var path = require("path");
var fs = require('fs-extra');
var pwd = process.cwd();
var uploadAction = require("./uploadAction");
var checkEnv = require("./checkEnv");
var pkg = require(path.join(pwd, "./package.json"));
var logger = require("./logger");

module.exports = function doUpload(cmsParams, auth, environment, isCmsOnly) {

  // 所有针对使用npm502端口的
  if (environment.indexOf('npm502') === 0) {
    isCmsOnly = true;
  }

  //delete .temp folder
  var folderZipPath = path.join(pwd, '.temp');
  if (fs.existsSync(folderZipPath)) {
    fs.removeSync(folderZipPath);
  }
  checkEnv(environment);

  if (!cmsParams || !cmsParams.length) {
    throw new Error("请在package.json中增加参数uploadParams，类型为数组，详见README文件");
  }

  // 上传文件至S.hubenlv及CMS
  var totalSteps = 2 * cmsParams.length;
  var currentStep = 0;
  Promise.all(cmsParams.map(params => {
    if (!params || !params.folder || !params.path || !params.name) {
      throw new Error("请提供上传CMS的参数:folder, name, path");
    }
    params.auth = auth;

    if (!params.forcePush) {
      params.forcePush = "true";
    }

    if (!params.description) {
      params.description = pkg.description || pkg.name;
    }
    // 上传所有文件至CMS
    if (isCmsOnly) {
      return uploadAction.uploadCMS(params, environment, '**/*.*');
    }

    const urlEnv = (environment === 'production' ? '' : ('-' + environment));

    currentStep++;
    logger.info('[' + currentStep + '/' + totalSteps + ']: 上传目录[' + params.folder + ']至S.hubenlv...');

    // 上传所有文件至s.hubenlv，再上传HTML至CMS
    return uploadAction.uploadStatic(params, environment).catch(function (err) {
      logger.error('上传' + params.folder + '目录至s[' + environment + '].hubenlv.com失败');
      logger.error("错误信息：", err);
      // eslint-disable-next-line
      process.exit(-1);
    })
      .then(function () {
        logger.debug('部署目录' + params.folder + '目录至s[' + environment + '].hubenlv.com成功');
        logger.info('S.hubenlv成功部署: https://s' + urlEnv + '.hubenlv.com/static/' + params.path);

        currentStep++;
        logger.info('[' + currentStep + '/' + totalSteps + ']: 上传目录' + params.folder + '至CMS...');

        return uploadAction.uploadCMS(params, environment)
      })
      .catch(function (err) {
        logger.error('上传' + params.folder + '目录至CMS[' + environment + ']失败');
        logger.error("错误信息：", err);
        // eslint-disable-next-line
        process.exit(-1);
      })
      .then(function () {
        logger.debug('部署目录' + params.folder + '目录至CMS[' + environment + ']成功');
        logger.info('CMS成功部署: https://www' + urlEnv + '.hubenlv.com/mkt/' + params.path + '/index.html');
      });
  })
  ).then(function () {
    logger.info("部署成功!");
  }, function () {
    logger.error("部署失败!");
  });
};
