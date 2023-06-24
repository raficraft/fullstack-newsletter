/** @type {import('next').NextConfig} */

const path = require('path');
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@css'] = path.resolve(__dirname, 'src/styles');

    return config;
  },
};

module.exports = nextConfig;
