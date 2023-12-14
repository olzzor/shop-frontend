const { CKEditorTranslationsPlugin } = require('@ckeditor/ckeditor5-dev-translations');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://bridgeshop.com:8080',
        changeOrigin: true,
        pathRewrite: {'^/api': ''}
      }
    },
    allowedHosts: 'all'
    // allowedHosts: ['localhost.test','admin.localhost.test']
  },
  configureWebpack: {
    plugins: [
      new CKEditorTranslationsPlugin({
        // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
        language: 'ko'
      })
    ],
    module: {
      rules: [
        {
          test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
          use: ['raw-loader']
        },
        {
          test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                injectType: 'singletonStyleTag',
                attributes: {
                  'data-cke': true
                }
              }
            },
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: styles.getPostCssConfig({
                  themeImporter: {
                    themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                  },
                  minify: true
                })
              }
            }
          ]
        }
      ]
    },
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false, // 개발 환경에서 소스 맵 활성화
  }
}