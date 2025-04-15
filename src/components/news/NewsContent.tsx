import { useTranslation } from "react-i18next";
import { useNews } from "../../contexts/NewsContext";
import FeaturedArticle from "./FeaturedArticle";
import LoadingState from "./LoadingState";
import NewsArticles from "./NewsArticles";

const NewsContent = () => {
  const { t } = useTranslation();
  const { loading, error, featuredArticle } = useNews();

  return (
    <div className="px-20 py-8 page news-page max-sm:px-4 max-lg:px-20 max-xl:px-10">
      <div className="mb-8">
        <h1 className="pl-4 mb-2 text-4xl font-bold border-l-4 border-primary md:text-4xl text-primary-600">
          {t("navigation.news")}
        </h1>
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
