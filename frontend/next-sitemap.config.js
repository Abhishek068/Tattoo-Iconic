/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://tattooiconic.in',
  generateRobotsTxt: false, // Managed natively via app/robots.ts
  sitemapSize: 7000,
  exclude: ['/dashboard/*', '/api/*', '/login', '/register'],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path === '/' ? 1.0 : 0.8,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
