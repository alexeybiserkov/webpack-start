module.exports = {
    loader: 'postcss-loader',
    options: {
        ident: 'postcss',
        plugins: (loader) => [
            require('postcss-import')({ root: loader.resourcePath }),
            require('postcss-cssnext')(),
            require('autoprefixer')(),
            require('cssnano')()
        ]
    }
}
