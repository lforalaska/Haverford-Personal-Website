export interface EssayData {
  title: string;
  date: string; // YYYY-MM-DD format
  slug: string;
  tags: string[];
  excerpt: string;
  draft: boolean;
  content: string;
}

export interface UploadRequest {
  file: File | null;
  title: string;
  date: string;
  slug: string;
  tags: string; // JSON array string
  excerpt: string;
  draft: boolean;
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  slug?: string;
}
