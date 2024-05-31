const fs = require("fs");
const path = require("path");

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/certificate.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/certificate.crt')),
    },
    proxy: {
      '/api': {
        target: `${process.env.VUE_APP_API_URL}`,
        changeOrigin: true,
        pathRewrite: {'^/api': ''}
      }
    },
    // allowedHosts: 'all'
    allowedHosts: ['shop.dev','admin.shop.dev','vincegarage.kro.kr','admin.vincegarage.kro.kr','bridgeshop.kro.kr','admin.bridgeshop.kro.kr']
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false, // 개발 환경에서 소스 맵 활성화
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/styles/_variables.scss";
          @import "@/styles/_mixin.scss";
        `
      }
    }
  }
}