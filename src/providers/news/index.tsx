import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchNewsArticlesFromFirebase } from "../../services/api";
import { NewsArticle } from "@/services/interfaces";
import { useTranslation } from "react-i18next";

interface NewsContextType {
  articles: NewsArticle[];
  filteredArticles: NewsArticle[];
  loading: boolean;
  error: string | null;
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  allTags: string[];
  featuredArticle: NewsArticle | null;
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
  const { t } = useTranslation();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]); // Store all articles for tags
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { i18n } = useTranslation();

  // Fetch all articles once for tags (independent of filter)
  useEffect(() => {
    const getAllArticles = async () => {
      try {
        const allData = await fetchNewsArticlesFromFirebase({
          lang: i18n.language,
          // No tag filter - get all articles for tags
        });
        setAllArticles(allData);
      } catch (err) {
        console.error("Error fetching all articles for tags:", err);
      }
    };

    getAllArticles();
  }, [i18n.language]);

  // Fetch filtered articles for display
  useEffect(() => {
    const getNewsArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchNewsArticlesFromFirebase({
          lang: i18n.language,
          tag: activeFilter,
        });
        setArticles(data);
      } catch (err) {
        setError(t("news.loadError"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getNewsArticles();
  }, [i18n.language, activeFilter]);

  // Extract tags from ALL articles, not just filtered ones
  const allTags = Array.from(
    new Set(allArticles.flatMap((article) => article.tags ?? []))
  )
    .filter((tag): tag is string => typeof tag === "string")
    .sort();

  const featuredArticle = articles.length > 0 ? articles[0] : null;

  const filteredArticles = articles.filter((article) => {
    const matchesTag =
      !activeFilter || (article.tags?.includes(activeFilter) ?? false);

    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.author ?? "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTag && matchesSearch;
  });

  const value = {
    articles,
    filteredArticles,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    allTags,
    featuredArticle,
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};
