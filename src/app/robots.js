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
          "/child-psychologist-online",
          "/api/",
          "/profile/"
        ],
      },
    ],
    sitemap: "https://www.little.care/sitemap.xml",
  };
}
