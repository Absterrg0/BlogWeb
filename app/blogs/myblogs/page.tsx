import UserPostsPage from "@/components/blogs/UserPosts";
export default function Page({ params }: { params: { id: string } }) {
  return <UserPostsPage userId={params.id} />;
}
