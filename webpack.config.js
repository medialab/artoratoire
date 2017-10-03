module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|woff|woff2|eot|ttf|svg)$/,
        use: 'file-loader'
      },
      {
        test: /\.(csv|txt)$/,
        use: 'raw-loader'
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
