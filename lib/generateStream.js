var fs = require('fs');
var logger = require("./logger");
var pwd = process.cwd();
var path = require("path");
var archiver = require('archiver');

module.exports = function(pattern, folder){
    // 在目录folder中使用匹配规则pattern，生成zip文件至临时目录
    return new Promise(function(resolve, reject) {

        var archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
          });
        
        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                // log warning
                logger.warn(err);
            } else {
                // throw error
                reject(err);
            }
        });
        
        // good practice to catch this error explicitly
        archive.on('error', function(err) {
            reject(err);
        });
    
        var folderZipPath = path.join(pwd, '.temp');

        var fileZipPath = path.join(folderZipPath, new Date().getTime()+'.zip');
    
        if (!fs.existsSync(folderZipPath)){
            fs.mkdirSync(folderZipPath);
        }

        var output = fs.createWriteStream(fileZipPath);

        output.on('close', function() {
            logger.debug('生成zip文件：'+fileZipPath);
            resolve(fileZipPath);
        });

        archive.pipe(output);
    
        archive.glob(pattern, {
          cwd: path.join(pwd, folder)
        });
    
        archive.finalize();

    });
}
