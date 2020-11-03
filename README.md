用于上传静态资源至服务器，上传时首先将资源上传，再将HTML上传

# 命令行模式

## 配置
在`package.json`中增加`uploadParams`属性，类型为数组。其中每个元素的属性示例如下：

```json
"uploadParams": [
    {
      "name": "H5",
      "description": "",
      "folder": "build",
      "path": "my-path",
      "timeout": 60000,
    }
  ],

```
* `name`: 参数必填，上传的名字，用于管理后台查看
* `description`: 参数必填，上传的描述信息
* `folder`: 参数必填，上传的文件所在目录
* `timeout`: 参数可选，上传超时时间，默认为60秒

在`package.json`中增加如下命令

```json

"scripts": {
    // 部署至dev环境
    "deploy-dev": "static-upload dev",
    // 部署至demo环境
    "deploy-demo": "static-upload demo",
    // 部署至demo1环境
    "deploy-demo1": "static-upload demo1",
    // 部署至production环境
    "deploy-production": "static-upload production",
    // 部署至npm502环境
    "deploy-npm502": "static-upload npm502",
    // 部署至npm502环境,端口为9000
    "deploy-npm502:9000": "static-upload npm502_9000"
  }

```

针对`package.json`中属性`uploadParams`中`folder`所指定的目录：
* 所有的文件，都将上传至s[dev|demo|demo1|production].hubenlv.com/static路径下
* 所有的HTML文件，将上传至www[-dev|demo].hubenlv.com/mkt路径下

# 仅上传至CMS
使用参数`--cms-only`支持将所有文件上传至CMS（当使用参数`npm502`时，此开关默认开启）
```json

"scripts": {
    "deploy-dev": "static-upload dev --cms-only",
    "deploy-demo": "static-upload demo --cms-only",
    // npm502默认开启--cms-only
    "deploy-npm502": "static-upload npm502",
    // npm502_[端口号]默认开启--cms-only
    "deploy-npm502_3000": "static-upload npm502_3000",
    "deploy-production": "static-upload production --cms-only"
  }

```

在命令行模式中，将读取环境变量:
* `STATIC_USERNAME`  作为用户名,
* `STATIC_PASSWORD`  作为密码

# Using as a module
```js
  const staticUpload = require('static-upload');

  const uploadParams = [
    {
      // 参数必填，上传的名字，用于管理后台查看
      "name": "H5",
      // 参数必填，上传的描述信息
      "description": "",
      // 参数必填，上传的文件所在目录
      "folder": "build",
      // 参数必填，上传的路径
      "path": "mca_h5",
      // 参数可选，上传超时时间，默认为60秒
      "timeout": 60000
    }
  ];

  const auth = {
    user: 'username',
    pass: 'password'
  };

  const environment = 'demo';
  // 上传所有文件至s.hubenlv,上传HTML至CMS
  staticUpload(uploadParams, auth, environment);

  // 上传所有文件至CMS
  staticUpload(uploadParams, auth, environment, true);

```
