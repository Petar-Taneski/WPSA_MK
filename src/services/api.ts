// API service for fetching news articles
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

// Function to fetch all news articles
export const fetchNewsArticles = async (): Promise<NewsArticle[]> => {
  try {
    // Replace with actual API endpoint when available
    const response = await fetch("https://api.example.com/news");
    if (!response.ok) {
      throw new Error("Failed to fetch news articles");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching news articles:", error);

    // Return mock data for now until API is implemented
    return MOCK_NEWS_ARTICLES;
  }
};

// Function to fetch a single news article by ID
export const fetchNewsArticle = async (
  id: string
): Promise<NewsArticle | null> => {
  try {
    // Replace with actual API endpoint when available
    const response = await fetch(`https://api.example.com/news/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch news article with ID: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching news article with ID: ${id}:`, error);

    // Return mock data for now until API is implemented
    return MOCK_NEWS_ARTICLES.find((article) => article.id === id) || null;
  }
};

// Mock data for development until API is available
const MOCK_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "1",
    title: "New Breakthrough in Poultry Feed Efficiency",
    summary:
      "Researchers have discovered a new dietary supplement that improves feed efficiency in broiler chickens by 15%.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies ultricies, nisl nisl ultricies nisl, eget ultricies nisl nisl eget ultricies ultricies, nisl nisl ultricies nisl, eget ultricies nisl nisl eget.",
    imageUrl:
      "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?q=80&w=1200",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?q=80&w=400",
    publishDate: "2023-10-15",
    author: "Dr. Jane Smith",
    tags: ["research", "nutrition", "efficiency"],
  },
  {
    id: "2",
    title: "Annual Poultry Science Conference Announced",
    summary:
      "The 2024 International Poultry Science Conference will be held in Vienna, Austria on September 5-8.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies ultricies, nisl nisl ultricies nisl, eget ultricies nisl nisl eget ultricies ultricies.",
    imageUrl:
      "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?q=80&w=1200",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?q=80&w=400",
    publishDate: "2023-11-20",
    author: "Conference Committee",
    tags: ["event", "conference", "international"],
  },
  {
    id: "3",
    title: "New Guidelines for Sustainable Poultry Farming Released",
    summary:
      "The World Poultry Science Association has published new guidelines for sustainable poultry production.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies ultricies, nisl nisl ultricies nisl, eget ultricies nisl nisl eget ultricies ultricies.",
    imageUrl:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1200",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=400",
    publishDate: "2023-12-05",
    author: "WPSA Committee on Sustainability",
    tags: ["sustainability", "guidelines", "environment"],
  },
  {
    id: "4",
    title: "Research Shows Benefits of Free-Range Farming",
    summary:
      "A new study reveals the health and welfare benefits of free-range poultry farming methods.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies ultricies, nisl nisl ultricies nisl, eget ultricies nisl nisl eget ultricies ultricies.",
    imageUrl:
      "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?q=80&w=1200",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?q=80&w=400",
    publishDate: "2024-01-18",
    author: "Dr. Michael Johnson",
    tags: ["research", "welfare", "free-range"],
  },
  {
    id: "5",
    title: "Advancements in Poultry Health Monitoring Technologies",
    summary:
      "New AI-powered technologies are revolutionizing how farmers monitor flock health and prevent disease outbreaks.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies ultricies, nisl nisl ultricies nisl, eget ultricies nisl nisl eget ultricies ultricies.",
    imageUrl:
      "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?q=80&w=1200",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?q=80&w=400",
    publishDate: "2024-02-10",
    author: "Tech Innovation Team",
    tags: ["technology", "health", "monitoring"],
  },
];
