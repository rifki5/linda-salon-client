const withTypescript = require("@zeit/next-typescript")
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const withLess = require('@zeit/next-less')
const withCss = require('@zeit/next-css')
const withPlugins = require('next-compose-plugins')
const optimizedImages = require('next-optimized-images')

const nextConfig = {
  // distDir: 'build',
  webpack(config, options) {
    // Do not run type checking twice:
    if (options.isServer) config.plugins.push(new ForkTsCheckerWebpackPlugin())
    
    return config
  }
};

module.exports = withPlugins([
  withTypescript,
  withLess,
  withCss,
  optimizedImages,
], nextConfig)