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
        data?.data?.blogs ||
        data?.message?.services ||
        data?.message?.assessments ||
        data?.message?.pages ||
        data?.message?.blogs ||
        data?.services ||
        data?.assessments ||
        data?.pages ||
        data?.blogs ||
        data?.data ||
        [];
      return (items || [])
        .filter((item) => item?.status === "published" && item?.slug)
        .map((item) => item.slug);
    } catch {
      return [];
    }
  }

  async function fetchPsychologists() {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.little.care";
      const res = await fetch(`${apiBase}/api/public/psychologists`, { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      const psychologists = 
        data?.data?.psychologists ||
        data?.message?.psychologists ||
        data?.psychologists ||
        [];
      return (psychologists || [])
        .filter((psych) => {
          const name = psych?.name || `${psych?.first_name || ''} ${psych?.last_name || ''}`.trim();
          return name;
        })
        .map((psych) => {
          const name = psych.name || `${psych.first_name || ''} ${psych.last_name || ''}`.trim();
          return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        });
    } catch {
      return [];
    }
  }

  const [counsellingSlugs, assessmentSlugs, parentingSlugs, blogSlugs, psychologistSlugs] = await Promise.all([
    fetchSlugs("/api/counselling"),
    fetchSlugs("/api/assessments"),
    fetchSlugs("/api/better-parenting"),
    fetchSlugs("/api/blogs"),
    fetchPsychologists(),
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
    ...blogSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...psychologistSlugs.map((slug) => ({
      url: `${baseUrl}/online-child-psycologist/${slug}`,
      changeFrequency: "monthly",
      priority: 0.9,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
