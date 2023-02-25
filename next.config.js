/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  i18n:{
    locales:['amh','orm','tgr','eng'],
    defaultLocale:'eng'
  },
  images:{
    remotePatterns:[
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.0.9',
        port: '9000',
        pathname: '/**',
      }
    ]
  }
}

module.exports = nextConfig
