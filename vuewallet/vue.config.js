// vue.config.js
const resolve = require('path').resolve

module.exports = {
    outputDir: resolve('D:\\CLionProjects\\litecoin\\src', 'html'),
    publicPath:'',
    filenameHashing:false,
    productionSourceMap:false,
    configureWebpack: {

        output: {

            filename:  '[name].js',
            chunkFilename: '[id].js?[chunkhash]',

        },
    }
}