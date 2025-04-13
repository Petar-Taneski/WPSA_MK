export interface NewsArticle {
    id: string;
    title: string;
    summary: string;
    content: string;
    imageUrl: string;
    thumbnailUrl: string;
    publishDate: string;
    author: string;
    tags: string[];
  }

  export interface Event {
    id: string;
    title: string;
    summary: string;
    content: string;
    imageUrl: string;
    thumbnailUrl: string;
    publishDate: string;
    eventDate: string;
    location?: string;
    callToAction?: string;
  }