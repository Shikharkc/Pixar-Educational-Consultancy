
import Link from 'next/link';
import { getAllPosts, type PostData } from '@/lib/posts';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, UserCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function BlogPage() {
  const posts = getAllPosts();

  if (!posts || posts.length === 0) {
    return (
      <div>
        <SectionTitle title="Our Blog" subtitle="Stay updated with the latest news and insights." />
        <p className="text-center text-foreground/70">No blog posts available at the moment. Please check back later!</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <SectionTitle title="Our Blog" subtitle="Stay updated with the latest news and insights from Pixar Educational Consultancy." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: PostData) => (
          <Card key={post.id} className="flex flex-col bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <Link href={`/blog/${post.id}`} className="hover:text-accent">
                <CardTitle className="font-headline text-xl text-primary mb-2">{post.title}</CardTitle>
              </Link>
              <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                <div className="flex items-center">
                  <CalendarDays className="mr-1.5 h-4 w-4" />
                  {post.date ? format(new Date(post.date), 'MMMM d, yyyy') : 'N/A'}
                </div>
                {post.author && (
                  <div className="flex items-center">
                    <UserCircle className="mr-1.5 h-4 w-4" />
                    {post.author}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-foreground/80 line-clamp-3">
                {post.excerpt || 'Read more to find out...'}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild variant="link" className="text-accent p-0 hover:text-primary">
                <Link href={`/blog/${post.id}`}>
                  Read More <BookOpen className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
