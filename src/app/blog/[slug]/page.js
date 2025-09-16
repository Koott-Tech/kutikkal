import BlogPost from "@/components/BlogPost";

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  return (
    <main>
      <BlogPost slug={slug} />
    </main>
  );
}
