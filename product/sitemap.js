import { BASE_URL } from '@/app/lib/constants'
import { getPosts } from '@/utils/sitemap/getData'

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
                url: `https://schooler-us.site/post/${post._id.toString()}`,
                lastModified: new Date(post.createdTime),
            }
        }),
    ]
  }