const path = require('path');

module.exports = {
  entry: {
    main: "./src/main.ts",
    course: "./src/course.ts"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
      rules: [
          {
              test: /\.ts$/,
              use: "ts-loader",
              exclude: /node_modules/,
          },
      ],
  },
  mode: 'production',
};
