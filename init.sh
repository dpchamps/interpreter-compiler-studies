#!/bin/bash
rm -rf ./.git
git init
npm init
npm install --save-dev babel-core babel-loader babel-minify-webpack-plugin babel-plugin-transform-class-properties babel-plugin-transform-decorators-legacy babel-preset-es2015 babel-preset-minify browser-sync browser-sync-webpack-plugin gulp uglifyjs-webpack-plugin webpack webpack-cli webpack-dev-middleware webpack-dev-server webpack-hot-middleware
npm install lodash
npm build
rm ./init.sh
