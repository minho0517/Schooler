/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");


const config = {
    experimental: {
        webpackBuildWorker: true,
    },
}

const nextConfig = withPWA({
    dest: "public",
    // disable: !isProduction,
    runtimeCaching: [],
}) (config);

module.exports = nextConfig
