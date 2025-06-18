
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/posts');

export interface PostData {
  id: string;
  title: string;
  date: string;
  author?: string;
  excerpt?: string;
  contentHtml?: string; // For individual post page
  [key: string]: any; // Allow other frontmatter fields
}

export function getAllPosts(): PostData[] {
  // Get file names under /src/posts
  let fileNames: string[] = [];
  try {
    fileNames = fs.readdirSync(postsDirectory);
  } catch (err) {
    console.error("Error reading posts directory:", postsDirectory, err);
    return []; // Return empty if directory doesn't exist or can't be read
  }
  
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md')) // Ensure only markdown files are processed
    .map(fileName => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        title: matterResult.data.title || 'Untitled Post',
        date: matterResult.data.date || new Date().toISOString().split('T')[0],
        author: matterResult.data.author || 'Pixar Edu Team',
        excerpt: matterResult.data.excerpt || '',
        ...matterResult.data,
      };
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  let fileNames: string[] = [];
  try {
    fileNames = fs.readdirSync(postsDirectory);
  } catch (err) {
     console.error("Error reading posts directory for slugs:", postsDirectory, err);
    return [];
  }
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  let fileContents = '';

  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
    console.error(`Error reading post file: ${fullPath}`, err);
    // Return a not-found like structure or throw an error
    // For now, returning a basic structure to avoid build failure,
    // but the page should handle this (e.g., by showing notFound())
    return {
        id,
        title: 'Post Not Found',
        date: new Date().toISOString().split('T')[0],
        contentHtml: '<p>This post could not be loaded.</p>'
    };
  }

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    title: matterResult.data.title || 'Untitled Post',
    date: matterResult.data.date || new Date().toISOString().split('T')[0],
    author: matterResult.data.author || 'Pixar Edu Team',
    excerpt: matterResult.data.excerpt || '',
    contentHtml,
    ...matterResult.data,
  };
}
