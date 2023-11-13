/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");


const config = {
}

const nextConfig = withPWA({
    dest: "public",
    // disable: !isProduction,
    runtimeCaching: runtimeCaching,
}) (config);

module.exports = nextConfig
