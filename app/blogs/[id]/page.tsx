// app/posts/[id]/page.tsx
import PostPage from "@/components/blogs/blogpage";
export default function Post({ params }: { params: { id: string } }) {
    return <PostPage params={params} />;
}
