#!/usr/bin/env node
var pwd = process.cwd();
var path = require("path");

var doUpload = require("../lib/index");
var pkg = require(path.join(pwd, "./package.json"));
var params = pkg.uploadParams;
var environment = process.argv[2];

var isCmsOnly = process.argv.indexOf('--cms-only') !== -1;

var auth = {
  user: process.env.STATIC_USERNAME,
  pass: process.env.STATIC_PASSWORD
};

doUpload(params, auth, environment, isCmsOnly);
