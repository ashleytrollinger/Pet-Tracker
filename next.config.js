/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    webpack: (config, { isServer }) => {
        // Exclude HTML files from being processed by Webpack on the server
        if (isServer) {
            config.module.rules.push({
                test: /\.html$/,
                loader: 'ignore-loader',
            });
        }

        return config;
    },
};
