import { getServerSession } from 'next-auth';
import { authValues } from '@/lib/auth'; // Adjust the import based on where your auth options are defined
import UserPosts from '@/components/blogs/UserPosts';

const UserPostsPage = async () => {
    // Fetch session data on the server
    const session = await getServerSession(authValues);

    if (!session || !session.user || !session.user.id) {
        // Redirect or show an error if the user is not authenticated
        return <div>You need to be authenticated to view this page.</div>;
    }

    return <UserPosts userId={session.user.id} />;
};

export default UserPostsPage;
