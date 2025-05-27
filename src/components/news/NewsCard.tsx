import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { NewsArticle } from "../../services/interfaces";
import ReadMoreButton from "../common/ReadMoreButton";
import { DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/consts";
import { parseDateString } from "@/lib/utils";

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard = ({ article }: NewsCardProps) => {
  const { id, title, summary, thumbnailUrl, publishDate, author } = article;
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const parsedDate = parseDateString(publishDate);
  const formattedDate = parsedDate
    ? parsedDate.toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : publishDate;

  const getPostUrl = () => {
    const currentLanguage = i18n.language;
    return currentLanguage === "mk" ? `/mk/вести/${id}` : `/en/news/${id}`;
  };

  const displayImageUrl = thumbnailUrl || DEFAULT_PLACEHOLDER_IMAGE;

  return (
    <div
      className="block h-full focus:outline-none focus:ring-2 focus:ring-primary/50"
      tabIndex={0}
      role="link"
      aria-label={`Read article: ${title}`}
    >
      <div className="flex flex-col h-full overflow-hidden transition-shadow duration-300 bg-white shadow-md group hover:shadow-lg">
        <div
          onClick={() => navigate(getPostUrl())}
          className="relative flex items-center justify-center h-48 overflow-hidden cursor-pointer max-md:h-80 bg-gray-50"
        >
          <img
            src={displayImageUrl}
            alt=""
            className={`h-full w-full ${
              !thumbnailUrl ? "object-contain p-8" : "object-cover"
            } transition-transform duration-300 group-hover:scale-102`}
          />
        </div>

        <div className="flex flex-col flex-grow p-4">
          <div className="mb-2 text-xs text-primary/85">{formattedDate}</div>

          <h3 className="mb-2 text-lg font-semibold text-gray-800/85 line-clamp-2">
            {title}
          </h3>
          <p className="flex-grow mb-4 text-sm leading-relaxed text-gray-600/80 line-clamp-3">
            {summary}
          </p>
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
            {author && (
              <span className="text-xs text-gray-500 italic truncate max-w-[60%]">
                {author}
              </span>
            )}
            <div onClick={(e) => e.stopPropagation()}>
              <ReadMoreButton articleId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
