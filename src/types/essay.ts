export interface EssayFrontmatter {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  excerpt: string;
  draft?: boolean;
}

export interface Essay {
  frontmatter: EssayFrontmatter;
  content: string;
  slug: string;
  readingTime: number;
}

export interface ProcessedEssay extends Essay {
  htmlContent: string;
}

export interface TagInfo {
  tag: string;
  count: number;
}
