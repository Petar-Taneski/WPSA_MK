import { NewsArticle } from "./interfaces";
import mockData from "./mockData.json";



export const fetchNewsArticles = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch("https://api.example.com/news");
    if (!response.ok) {
      throw new Error("Failed to fetch news articles");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return mockData.articles;
  }
};

// TODO: Replace with actual API endpoint when available, remove mock data on error
//TODO: filtering should be done on backend. currently it is done on frontend
export const fetchNewsArticle = async (
  id: string
): Promise<NewsArticle | null> => {
  try {
    const response = await fetch(`https://api.example.com/news/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch news article with ID: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching news article with ID: ${id}:`, error);
    return mockData.articles.find((article) => article.id === id) || null;
  }
};


