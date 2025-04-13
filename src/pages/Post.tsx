import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get the news path
  const getNewsPath = () => {
    return "/news";
  };

  useEffect(() => {
    if (params.id) {
      const fetchArticle = async () => {
        try {
          setLoading(true);
          const articleData = await fetchNewsArticle(params.id as string);

          if (!articleData) {
            setError("Article not found");
          } else {
            setArticle(articleData);
          }
        } catch (err) {
          setError("Failed to load article");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    } else {
      setError("No article ID provided");
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return <PostLoading />;
  }

  if (error || !article) {
    return <PostError message={error || "Article not found"} />;
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
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Back to News
        </button>
      </div>
    </div>
  );
};

export default Post;
