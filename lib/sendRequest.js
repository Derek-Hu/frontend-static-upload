var request = require("request");
var fs = require('fs');
var generateStream = require('./generateStream');
var logger = require("./logger");

module.exports = function sendRequest(pattern, method, url, params, formData, auth) {

  return new Promise(function (resolve, reject) {

    generateStream(pattern, params.folder).then(function (fileZipPath) {

      formData.file = {
        value: fs.readFileSync(fileZipPath),
        options: {
          filename: 'static.zip',
          contentType: 'application/zip'
        }
      };

      request[method]({
        url: url,
        formData: formData,
        timeout: params.timeout || 600000,
        // gzip: true,

        headers: {
          "Accept-Language": "en",
          Accept: "*/*",
          "User-Agent": "request"
        },
        auth: auth
      }, function callback(err, response, body) {

        // remove file
        fs.unlink(fileZipPath, (err) => {
          if (err) throw err;
          logger.debug('successfully deleted ' + fileZipPath);
        });

        if (err) {
          reject(err);
          return;
        }
        try {
          var data = JSON.parse(body);
          if (data.result !== "success") {
            // 当出现敏感词、禁用词时，打印
            console.log(body)
            reject(data);
            return;
          }
          resolve(data);
        } catch (e) {
          console.log(body)
          reject(e);
        }
      }
      )

    });

  });
};
