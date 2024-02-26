export const getPosts = async () => {
    return fetch(`${process.env.ABSOLUTE_URL}/api/sitemap/post`, {
        next: { revalidate: 60 * 10 },
    })
    .then((res) => {
        if (!res.ok) {
        return Promise.reject();
        }
        return res.json();
    })
    .catch(() => {
        return [];
    });
}

export default async function sitemap() {

    const posts = await getPosts();

    return [
        {
            url: 'https://schooler-us.site',
            lastModified: new Date(),
            priority: 1,
        },
        ...posts.map((post) => {
            return {
                url: `https://schooler-us.site/post/${post._id}`,
                lastModified: new Date(post.createdTime),
            }
        }),
    ]
  }