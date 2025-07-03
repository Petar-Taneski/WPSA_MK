interface LinkPair {
  name: string;
  url: string;
}
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  publishDate: string;
  author?: string;
  tags?: string[];
  links?: LinkPair[];
  lang: string;
}

export interface Event {
  id: string;
  title: string;
  summary: string;
  content: string;
  isFeatured?: boolean;
  imageUrl?: string;
  publishDate: string;
  eventDate: string;
  eventEndDate?: string;
  location: string;
  links?: LinkPair[];
  lang: string;
  formUrl?: string;
}
