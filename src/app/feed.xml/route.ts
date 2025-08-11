import RSS from 'rss';
import { getAllPosts } from '@/lib/posts';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixaredu.com';

export async function GET() {
  const feed = new RSS({
    title: 'Pixar Educational Consultancy Blog',
    description: 'Stay updated with the latest news and insights from Pixar Educational Consultancy.',
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.xml`,
    language: 'en',
    pubDate: new Date(),
  });

  const allPosts = getAllPosts();
  allPosts.forEach(post => {
    feed.item({
      title: post.title,
      description: post.excerpt || '',
      url: `${SITE_URL}/blog/${post.id}`,
      guid: post.id,
      date: new Date(post.date),
      author: post.author || 'Pixar Edu Team',
    });
  });

  const xml = feed.xml({ indent: true });

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
