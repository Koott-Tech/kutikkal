export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/profile/", "/superadmin/"],
      },
    ],
    sitemap: "https://www.little.care/sitemap.xml",
  };
}
