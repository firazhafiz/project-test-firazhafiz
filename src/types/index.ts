export interface ImageAsset {
  file_name: string;
  id: number;
  mime: string;
  url: string;
}

export interface Post {
  id: number;
  title: string;
  published_at: string;
  small_image: ImageAsset[];
  medium_image: ImageAsset[];
}

export interface ApiResponse {
  data: Post[];
  meta: {
    current_page: number;
    from: number;
    last_page: number; // Ini adalah pageCount
    per_page: number; // Ini adalah pageSize
    to: number;
    total: number;
  };
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}
