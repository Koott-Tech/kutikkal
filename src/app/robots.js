export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/superadmin/",
          "/psychologist/",
          "/finance/",
          "/ads",
          "/api/",
          "/profile/"
        ],
      },
    ],
    sitemap: "https://www.little.care/sitemap.xml",
  };
}
