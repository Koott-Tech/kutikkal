export default async function sitemap() {
  const baseUrl = "https://www.little.care";

  const staticRoutes = ["", "/about", "/psychologists", "/therapy-agreement", "/privacy-policy", "/terms-and-conditions", "/refund-policy"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: "monthly",
      priority: route === "" ? 1.0 : 0.7,
    })
  );

  async function fetchSlugs(path) {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.little.care";
      const res = await fetch(`${apiBase}${path}?limit=100`, { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      const items =
        data?.data?.services ||
        data?.data?.assessments ||
        data?.data?.pages ||
        data?.message?.services ||
        data?.message?.assessments ||
        data?.message?.pages ||
        data?.services ||
        data?.assessments ||
        data?.pages ||
        data?.data ||
        [];
      return (items || [])
        .filter((item) => item?.status === "published" && item?.slug)
        .map((item) => item.slug);
    } catch {
      return [];
    }
  }

  const [counsellingSlugs, assessmentSlugs, parentingSlugs] = await Promise.all([
    fetchSlugs("/api/counselling"),
    fetchSlugs("/api/assessments"),
    fetchSlugs("/api/better-parenting"),
  ]);

  const dynamicRoutes = [
    ...counsellingSlugs.map((slug) => ({
      url: `${baseUrl}/counselling/${slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    ...assessmentSlugs.map((slug) => ({
      url: `${baseUrl}/assessments/${slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    ...parentingSlugs.map((slug) => ({
      url: `${baseUrl}/better-parenting/${slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
