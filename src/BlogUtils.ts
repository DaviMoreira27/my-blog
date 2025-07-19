const postModules = import.meta.glob("../src/contents/blog/**/*.{md,mdx}", {
  eager: true,
});
const postFiles = import.meta.glob("../src/contents/blog/**/*.{md,mdx}", {
  as: "raw",
  eager: true,
});

const aboutModules = import.meta.glob(
  "../src/contents/about-me/**/*.{md,mdx}",
  {
    eager: true,
  }
);
const aboutFiles = import.meta.glob("../src/contents/about-me/**/*.{md,mdx}", {
  as: "raw",
  eager: true,
});

const projectModules = import.meta.glob(
  "../src/contents/projects/**/*.{md,mdx}",
  {
    eager: true,
  }
);
const projectFiles = import.meta.glob(
  "../src/contents/projects/**/*.{md,mdx}",
  {
    as: "raw",
    eager: true,
  }
);

interface MDXModule {
  frontmatter: {
    title: string;
    description: string;
    publishDate?: string;
    date?: string;
    readingTime?: string;
    tags?: string[];
    author?: string;
    draft?: boolean;
    showToc?: boolean;
    period?: string;
    [key: string]: any;
  };
  default: any;
  Content: any;
  compiledContent?: () => string;
  file?: string;
  url?: string;
}

export interface BlogPost {
  title: string;
  description: string;
  publishDate: string;
  readingTime?: string;
  tags?: string[];
  author?: string;
  draft?: boolean;
  showToc?: boolean;
  slug: string;
  content: MDXModule;
}

export interface Project {
  title: string;
  description: string;
  period: string;
  readingTime?: string;
  tags?: string[];
  author?: string;
  draft?: boolean;
  showToc?: boolean;
  slug: string;
  content: MDXModule;
}

export function calculateReadingTime(content?: string): string {
  if (!content) return "1 minute of reading";

  const wordsPerMinute = 150;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return minutes <= 1 ? "1 minute of reading" : `${minutes} minutes of reading`;
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getSlugFromPath(filePath: string): string {
  return (
    filePath
      .split("/")
      .pop()
      ?.replace(/\.mdx?$/, "") || ""
  );
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  for (const [pathRelative, module] of Object.entries(postModules)) {
    const mdxModule = module as MDXModule;

    if (!mdxModule.frontmatter || mdxModule.frontmatter.draft) continue;

    const slug = getSlugFromPath(pathRelative);
    const publishDate =
      mdxModule.frontmatter.publishDate || mdxModule.frontmatter.date;

    if (!publishDate) {
      console.warn(`Post ${slug} has no publishDate in the frontMatter`);
      continue;
    }

    const rawContent = postFiles[pathRelative];
    const readingTime =
      mdxModule.frontmatter.readingTime || calculateReadingTime(rawContent);

    posts.push({
      title: mdxModule.frontmatter.title,
      description: mdxModule.frontmatter.description,
      publishDate,
      readingTime,
      tags: mdxModule.frontmatter.tags || [],
      author: mdxModule.frontmatter.author,
      draft: mdxModule.frontmatter.draft || false,
      showToc: mdxModule.frontmatter.showToc !== false,
      slug,
      content: mdxModule,
    });
  }

  return posts.sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export async function getAllProjects(): Promise<Project[]> {
  const projects: Project[] = [];

  for (const [pathRelative, module] of Object.entries(projectModules)) {
    const mdxModule = module as MDXModule;

    if (!mdxModule.frontmatter || mdxModule.frontmatter.draft) continue;

    const slug = getSlugFromPath(pathRelative);
    const period = mdxModule.frontmatter.period || mdxModule.frontmatter.date;

    if (!period) {
      console.warn(`Project ${slug} has no period in the frontMatter`);
      continue;
    }

    const rawContent = projectFiles[pathRelative];
    const readingTime =
      mdxModule.frontmatter.readingTime || calculateReadingTime(rawContent);

    projects.push({
      title: mdxModule.frontmatter.title,
      description: mdxModule.frontmatter.description,
      period,
      readingTime,
      tags: mdxModule.frontmatter.tags || [],
      author: mdxModule.frontmatter.author,
      draft: mdxModule.frontmatter.draft || false,
      showToc: mdxModule.frontmatter.showToc !== false,
      slug,
      content: mdxModule,
    });
  }

  return projects;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const combinedModules = { ...postModules, ...aboutModules };
  const combinedFiles = { ...postFiles, ...aboutFiles };

  const entry = Object.entries(combinedModules).find(
    ([path]) => path.includes(`${slug}.md`) || path.includes(`${slug}.mdx`)
  );

  if (!entry) return null;

  const [pathRelative, mdxModule] = entry;
  const typedModule = mdxModule as MDXModule;

  const publishDate =
    typedModule.frontmatter.publishDate || typedModule.frontmatter.date;

  if (!publishDate) {
    console.warn(`Post ${slug} has no publishDate in the frontMatter`);
    return null;
  }

  const rawContent = combinedFiles[pathRelative];
  const readingTime =
    typedModule.frontmatter.readingTime || calculateReadingTime(rawContent);

  return {
    title: typedModule.frontmatter.title,
    description: typedModule.frontmatter.description,
    publishDate,
    readingTime,
    tags: typedModule.frontmatter.tags || [],
    author: typedModule.frontmatter.author,
    draft: typedModule.frontmatter.draft || false,
    showToc: typedModule.frontmatter.showToc !== false,
    slug,
    content: typedModule,
  };
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const combinedModules = { ...projectModules };
  const combinedFiles = { ...projectFiles };

  const entry = Object.entries(combinedModules).find(
    ([path]) => path.includes(`${slug}.md`) || path.includes(`${slug}.mdx`)
  );

  if (!entry) return null;

  const [pathRelative, mdxModule] = entry;
  const typedModule = mdxModule as MDXModule;

  const period = typedModule.frontmatter.period || typedModule.frontmatter.date;

  if (!period) {
    console.warn(`Project ${slug} has no period in the frontMatter`);
    return null;
  }

  const rawContent = combinedFiles[pathRelative];
  const readingTime =
    typedModule.frontmatter.readingTime || calculateReadingTime(rawContent);

  return {
    title: typedModule.frontmatter.title,
    description: typedModule.frontmatter.description,
    period,
    readingTime,
    tags: typedModule.frontmatter.tags || [],
    author: typedModule.frontmatter.author,
    draft: typedModule.frontmatter.draft || false,
    showToc: typedModule.frontmatter.showToc !== false,
    slug,
    content: typedModule,
  };
}

export async function getAboutContent(): Promise<MDXModule | null> {
  try {
    const aboutModule = (await import(
      "../src/contents/about-me/about-me.mdx"
    )) as unknown as MDXModule;
    return aboutModule;
  } catch (error) {
    console.error("Error loading the about me content:", error);
    return null;
  }
}
