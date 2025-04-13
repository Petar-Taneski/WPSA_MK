import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchNewsArticle } from "../services/api";
import { NewsArticle } from "../services/interfaces";
import {
  PostHeader,
  PostMetadata,
  PostContent,
  PostLoading,
  PostError,
} from "../components/Post";

const Post: React.FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get the news path based on current language
  const getNewsPath = () => {
    const currentLanguage = i18n.language;
    switch (currentLanguage) {
      case "mk":
        return "/mk/вести";
      case "en":
      default:
        return "/en/news";
    }
  };

  useEffect(() => {
    if (params.id) {
      const fetchArticle = async () => {
        try {
          setLoading(true);
          const articleData = await fetchNewsArticle(params.id as string);

          if (!articleData) {
            setError(t("post.notFound"));
          } else {
            setArticle(articleData);
          }
        } catch (err) {
          setError(t("post.loadError"));
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    } else {
      setError(t("post.noIdProvided"));
      setLoading(false);
    }
  }, [params.id, t]);

  if (loading) {
    return <PostLoading />;
  }

  if (error || !article) {
    return <PostError message={error || t("post.notFound")} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PostHeader title={article.title} imageUrl={article.imageUrl} />

      <PostMetadata
        author={article.author}
        publishDate={article.publishDate}
        tags={article.tags}
      />

      <PostContent content={article.content} />

      <div className="mt-12 text-center">
        <button
          onClick={() => navigate(getNewsPath())}
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          {t("post.backToNews")}
        </button>
      </div>
    </div>
  );
};

export default Post;
