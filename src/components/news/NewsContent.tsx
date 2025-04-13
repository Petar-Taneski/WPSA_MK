import { useTranslation } from "react-i18next";
import { useNews } from "../../contexts/NewsContext";
import FeaturedArticle from "./FeaturedArticle";
import LoadingState from "./LoadingState";
import NewsArticles from "./NewsArticles";

const NewsContent = () => {
  const { t } = useTranslation();
  const { loading, error, featuredArticle } = useNews();

  return (
    <div className="page news-page max-sm:px-4 max-lg:px-20 max-xl:px-10 px-20 py-8">
      <div className="mb-8">
        <h1 className="border-l-4 border-primary pl-4 text-4xl md:text-4xl font-bold text-primary-600 mb-2">
          {t("navigation.news")}
        </h1>
      </div>

      {loading && <LoadingState />}

      {error && !loading && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
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
