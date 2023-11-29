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
    register: true,
    skipWaiting: true,
    runtimeCaching: [],
}) (config);

module.exports = nextConfig
