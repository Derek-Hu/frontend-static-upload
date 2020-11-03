var sDRAPIURL = {
  dev: "http://cms-dev.b8.dr.hubenlv.io/internal/files/name",
  demo: "http://cms-demo.b8.dr.hubenlv.io/internal/files/name",
  demo1: "http://cms-demo1.b8.dr.hubenlv.io/internal/files/name",
  production: "http://cms.idc1.dr.hubenlv.io/internal/files/name"
};

var cmsAPIURL = {
  dev: "http://cms-dev.b8.dr.hubenlv.io/internal/hp-landings/fepage",
  npm502: "http://cms-demo.b8.dr.hubenlv.io/internal/hp-landings/fepage",
  demo: "http://cms-demo.b8.dr.hubenlv.io/internal/hp-landings/fepage",
  demo1: "http://cms-demo1.b8.dr.hubenlv.io/internal/hp-landings/fepage",
  production: "http://cms.idc1.dr.hubenlv.io/internal/hp-landings/fepage"
};

module.exports.cmsAPIURL = cmsAPIURL;

module.exports.sDRAPIURL = sDRAPIURL;

module.exports.supportedEnvs = Object.keys(cmsAPIURL);
