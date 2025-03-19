// API service for fetching news articles
import mockData from "./mockData.json";

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
    // Return mock data from JSON file
    return mockData.articles;
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
    // Return mock data from JSON file
    return mockData.articles.find((article) => article.id === id) || null;
  }
};
