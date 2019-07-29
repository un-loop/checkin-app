const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        403: __dirname + "/403.jsx",
        404: __dirname + "/404.jsx",
        500: __dirname + "/500.jsx",
        generic: __dirname + "/generic.jsx"
    },
    output: {
        filename: "[id]-bundle.js",
        path: path.resolve(__dirname, "../client")
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
        extensions: [".js", ".jsx", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-env",
                            {
                                "targets": {
                                    "browsers": ["last 2 chrome versions"]
                                  }
                            }
                            ],
                            "@babel/preset-react",
                        ],
                        plugins: [
                            [
                                "@babel/plugin-transform-runtime",
                                {
                                  "corejs": false,
                                  "helpers": false,
                                  "regenerator": true,
                                  "useESModules": false
                                }
                              ]
                            ]
                    }
                }
            }
        ]
    }
};
