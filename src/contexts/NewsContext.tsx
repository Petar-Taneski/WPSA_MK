import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchNewsArticles, NewsArticle } from "../services/api";

interface NewsContextType {
  articles: NewsArticle[];
  filteredArticles: NewsArticle[];
  loading: boolean;
  error: string | null;
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  allTags: string[];
  featuredArticle: NewsArticle | null;
  remainingArticles: NewsArticle[];
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNews = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
};

interface NewsProviderProps {
  children: ReactNode;
}

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const getNewsArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchNewsArticles();
        setArticles(data);
      } catch (err) {
        setError("Failed to load news articles");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getNewsArticles();
  }, []);

  // Extract all unique tags from articles
  const allTags = Array.from(
    new Set(articles.flatMap((article) => article.tags))
  ).sort();

  // Filter articles based on active filter and search query
  const filteredArticles = articles.filter((article) => {
    // Filter by tag if active
    const matchesTag = !activeFilter || article.tags.includes(activeFilter);

    // Filter by search query if present
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTag && matchesSearch;
  });

  // Get the featured article (newest)
  const featuredArticle =
    filteredArticles.length > 0 ? filteredArticles[0] : null;

  // Remaining articles (excluding the featured one)
  const remainingArticles = featuredArticle
    ? filteredArticles.slice(1)
    : filteredArticles;

  const value = {
    articles,
    filteredArticles,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    allTags,
    featuredArticle,
    remainingArticles,
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};
