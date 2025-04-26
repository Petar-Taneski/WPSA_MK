import { useTranslation } from "react-i18next";
import { useNews } from "../../contexts/NewsContext";
import FeaturedArticle from "./FeaturedArticle";
import LoadingState from "./LoadingState";
import NewsArticles from "./NewsArticles";

const NewsContent = () => {
  const { t } = useTranslation();
  const { loading, error, featuredArticle } = useNews();

  return (
    <div className="px-20 pt-8 pb-16 page news-page max-sm:px-4 max-lg:px-20 max-xl:px-10">
      <div className="container px-6 mx-auto mb-12">
        <h2 className="mb-3 text-3xl font-bold text-center md:text-4xl text-primary/85">
          {t("news.recentTitle")}
        </h2>
        <p className="max-w-2xl mx-auto text-center text-slate-700/80">
          {t("news.recentDescription")}
        </p>
        <div className="w-24 h-1 mx-auto mt-4 rounded bg-primary"></div>
      </div>

      {loading && <LoadingState />}

      {error && !loading && (
        <div className="p-4 text-red-700 border border-red-200 rounded-md bg-red-50">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {featuredArticle && <FeaturedArticle article={featuredArticle} />}

          <NewsArticles />
        </>
      )}
    </div>
  );
};

export default NewsContent;
