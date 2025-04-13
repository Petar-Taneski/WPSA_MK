import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { NewsArticle } from "../../services/interfaces";
import ReadMoreButton from "../common/ReadMoreButton";

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard = ({ article }: NewsCardProps) => {
  const { id, title, summary, thumbnailUrl, publishDate, author } = article;
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const formattedDate = new Date(publishDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getPostUrl = () => {
    const currentLanguage = i18n.language;
    return currentLanguage === "mk" ? `/mk/вести/${id}` : `/en/news/${id}`;
  };

  const displayImageUrl = thumbnailUrl || "/placeholder.jpg";

  return (
    <div
      className="block h-full focus:outline-none focus:ring-2 focus:ring-primary/50"
      tabIndex={0}
      role="link"
      aria-label={`Read article: ${title}`}
    >
      <div className="group bg-white h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div
          onClick={() => navigate(getPostUrl())}
          className="relative h-48 max-md:h-80 overflow-hidden cursor-pointer"
        >
          <img
            src={displayImageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="text-xs text-gray-500 mb-2">{formattedDate}</div>

          <h3 className="text-lg font-semibold text-gray-800/85 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600/80 line-clamp-3 flex-grow mb-4 leading-relaxed">
            {summary}
          </p>
          <div className="mt-auto border-t border-gray-100 pt-3 flex justify-between items-center">
            <span className="text-xs text-gray-500 italic truncate max-w-[60%]">
              {author || "WPSA MK"}
            </span>
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
