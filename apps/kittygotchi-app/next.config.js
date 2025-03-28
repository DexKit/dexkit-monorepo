/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')([
  '@dexkit/widgets',
  '@dexkit/ui',
  '@dexkit/core',
]); // pass the modules you would like to see transpiled

module.exports = withTM({
  reactStrictMode: true,
});
