import { NewsArticle } from "@/services/interfaces";
import { useTranslation } from "react-i18next";
import ReadMoreButton from "../common/ReadMoreButton";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/consts";
import { parseDateString } from "@/lib/utils";

interface FeaturedArticleProps {
  article: NewsArticle;
}

const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  const { t, i18n } = useTranslation();
  const { id, title, summary, publishDate, author } = article;
  const navigate = useNavigate();
  const getPostUrl = () => {
    const currentLanguage = i18n.language;
    return currentLanguage === "mk" ? `/mk/вести/${id}` : `/en/news/${id}`;
  };
  console.log(article);

  const parsedDate = parseDateString(publishDate);
  const formattedDate = parsedDate
    ? parsedDate.toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : publishDate;

  const displayImageUrl =
    article.imageUrl || article.thumbnailUrl || DEFAULT_PLACEHOLDER_IMAGE;

  return (
    <div className="hover:shadow-md shadow-sm transition-shadow duration-300 group rounded-sm mb-1">
      <div className="flex flex-col h-full lg:flex-row">
        <div className="lg:w-3/5 flex flex-col order-2 lg:order-1 py-6 px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800/85 mb-3 pb-3 border-b border-primary-500">
            {title}
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500/70 mb-4">
            <span>{formattedDate}</span>
            {author && <span>• {author}</span>}
            {Array.isArray(article.tags) && article.tags.length > 0 && (
              <span className="font-medium text-primary">
                • {article.tags.join(", ")}
              </span>
            )}
            <span className="font-medium text-primary">
              • {t("news.featured")}
            </span>
          </div>

          <p className="text-base md:text-lg text-gray-700/90 leading-relaxed mb-6 flex-grow">
            {summary}
          </p>

          <ReadMoreButton articleId={id} className="mt-auto self-end" />
        </div>

        <div
          onClick={() => navigate(getPostUrl())}
          className="lg:w-1/2 mb-4 lg:mb-0 order-1 lg:order-2 cursor-pointer"
        >
          <div className="aspect-video lg:h-full rounded-sm overflow-hidden bg-gray-50 flex items-center justify-center">
            <img
              src={displayImageUrl}
              alt={title}
              className={`w-full h-full ${
                !article.imageUrl && !article.thumbnailUrl
                  ? "object-contain p-8"
                  : "object-cover"
              } transition-transform duration-300 group-hover:scale-102`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;
