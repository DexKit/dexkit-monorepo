/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "@dexkit/exchange",
  "@dexkit/ui",
  "@dexkit/core",
]); // pass the modules you would like to see transpiled

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withTM(nextConfig);
