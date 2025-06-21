'use client';

import Link from 'next/link';
import { type PostData } from '@/lib/posts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, UserCircle, BookOpen, Filter as FilterIcon, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, isAfter, subDays, subMonths, subYears, startOfDay } from 'date-fns';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BlogListWithFilterProps {
  initialPosts: PostData[];
}

const timeFilterOptions = [
  { value: 'all', label: 'All Time' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 3 Months' },
  { value: '1y', label: 'Last Year' },
];

const postsPerPageOptions = [10, 20, 50];

export default function BlogListWithFilter({ initialPosts }: BlogListWithFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  
  // These states will be populated on the client-side to prevent hydration errors.
  const [displayedPosts, setDisplayedPosts] = useState<PostData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    // All filtering and pagination logic now runs only on the client side.
    let posts = initialPosts;

    if (searchQuery) {
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTimeFilter !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (selectedTimeFilter) {
        case '7d': startDate = subDays(now, 7); break;
        case '30d': startDate = subDays(now, 30); break;
        case '90d': startDate = subMonths(now, 3); break;
        case '1y': startDate = subYears(now, 1); break;
        default: startDate = new Date(0);
      }
      
      const startOfFilterDate = startOfDay(startDate);

      posts = posts.filter(post => {
        try {
          const postDate = startOfDay(new Date(post.date));
          return isAfter(postDate, startOfFilterDate) || postDate.getTime() === startOfFilterDate.getTime();
        } catch (e) {
          console.error("Error parsing date for post:", post.title, post.date, e);
          return false;
        }
      });
    }

    const newTotalPages = Math.ceil(posts.length / postsPerPage);
    setTotalPages(newTotalPages);
    
    // Reset to page 1 if current page is out of bounds after filtering
    if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(1);
    }
    
    const startIndex = (currentPage - 1) * postsPerPage;
    setDisplayedPosts(posts.slice(startIndex, startIndex + postsPerPage));
    setIsClientLoaded(true); // Mark client as loaded to show content

  }, [initialPosts, searchQuery, selectedTimeFilter, postsPerPage, currentPage]);
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handleTimeFilterChange = (value: string) => {
    setSelectedTimeFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePostsPerPageChange = (value: string) => {
    setPostsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page on page size change
  };

  const handlePageChange = (newPage: number) => {
    if(newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  }

  return (
    <div>
      {/* Top Controls: Search and Filters */}
      <div className="mb-8 p-4 bg-card border rounded-lg shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center space-x-2">
            <FilterIcon className="h-5 w-5 text-primary" />
            <Label htmlFor="timeFilter" className="text-md font-medium">Filter by Date:</Label>
            <Select value={selectedTimeFilter} onValueChange={handleTimeFilterChange}>
              <SelectTrigger id="timeFilter" className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeFilterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="postsPerPage" className="text-md font-medium">Posts per page:</Label>
             <Select value={String(postsPerPage)} onValueChange={handlePostsPerPageChange}>
              <SelectTrigger id="postsPerPage" className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {postsPerPageOptions.map(option => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Blog List */}
      {!isClientLoaded ? (
        <div className="text-center py-16 bg-card border rounded-lg flex items-center justify-center min-h-[300px]">
           <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
           <p className="text-xl text-foreground/70">Loading posts...</p>
        </div>
      ) : displayedPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts.map((post: PostData) => (
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
      ) : (
        <div className="text-center py-16 bg-card border rounded-lg min-h-[300px] flex flex-col justify-center items-center">
          <p className="text-xl text-foreground/70">No blog posts found.</p>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {isClientLoaded && totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
