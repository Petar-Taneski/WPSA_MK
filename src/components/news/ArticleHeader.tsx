import { NewsArticle } from "../../services/api";
import ReadMoreButton from "../common/ReadMoreButton";

interface ArticleHeaderProps {
  article: NewsArticle;
}

const ArticleHeader = ({ article }: ArticleHeaderProps) => {
  const { title, imageUrl, publishDate, author, tags } = article;

  // Format the date to be more readable
  const formattedDate = new Date(publishDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative">
      <div className="h-[40vh] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-10">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-sm bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {title}
        </h1>

        {/* Meta information */}
        <div className="flex flex-wrap items-center text-white/90 gap-x-6 gap-y-2">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span>{author}</span>
          </div>
        </div>
        <div className="mt-6">
          <ReadMoreButton
            articleId={article.id}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-6 py-2 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleHeader;
