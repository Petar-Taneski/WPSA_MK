import { NewsArticle } from "@/services/interfaces";
import { useTranslation } from "react-i18next";
import ReadMoreButton from "../common/ReadMoreButton";
import { DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/consts";
import { parseDateString } from "@/lib/utils";

interface FeaturedArticleProps {
  article: NewsArticle;
}

const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  const { t, i18n } = useTranslation();
  const { id, title, summary, publishDate, author } = article;
  const getPostUrl = () => {
    const currentLanguage = i18n.language;
    return currentLanguage === "mk" ? `/mk/вести/${id}` : `/en/news/${id}`;
  };

  const parsedDate = parseDateString(publishDate);
  const formattedDate = parsedDate
    ? parsedDate.toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : publishDate;

  const displayImageUrl = article.imageUrl || DEFAULT_PLACEHOLDER_IMAGE;

  return (
    <div className="flex items-center justify-center w-full">
      <div className="mb-1 transition-shadow duration-300 rounded-sm shadow-sm hover:shadow-md group w-[80vw] ">
        <div className="flex flex-col h-full lg:flex-row">
          <div className="flex flex-col order-2 px-8 py-6 lg:w-3/5 lg:order-1">
            <h2 className="pb-3 mb-3 text-2xl font-bold border-b md:text-3xl lg:text-4xl text-gray-800/85 border-primary-500">
              {title}
            </h2>

            <div className="flex flex-wrap items-center mb-4 text-sm gap-x-4 gap-y-1 text-gray-500/70">
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

            <p className="flex-grow mb-6 text-base leading-relaxed md:text-lg text-gray-700/90">
              {summary}
            </p>

            <ReadMoreButton articleId={id} className="self-end mt-auto" />
          </div>

          <a
            href={getPostUrl()}
            className="flex items-center order-1 justify-centermb-4 lg:w-1/2 lg:mb-0 lg:order-2"
            aria-label={`Read full article: ${title}`}
          >
            <div className="flex items-center justify-center w-full overflow-hidden rounded-sm bg-gray-50">
              <img
                src={displayImageUrl}
                alt={title}
                className={`w-full h-full ${
                  !article.imageUrl ? "object-contain p-8" : "object-fill"
                } transition-transform duration-300 group-hover:scale-102`}
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;
