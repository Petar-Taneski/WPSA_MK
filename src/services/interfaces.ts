interface LinkPair {
  name: string;
  url: string;
}

interface galleryPhoto {
  url: string;
  altText: string;
}
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  altText?: string;
  publishDate: string;
  author?: string;
  tags?: string[];
  links?: LinkPair[];
  lang: string;
  correspondingId?: string;
  gallery?: galleryPhoto[];
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
  gallery?: galleryPhoto[];
}
