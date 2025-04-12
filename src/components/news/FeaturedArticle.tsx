import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import ReadMoreButton from "../common/ReadMoreButton";
import { NewsArticle } from "@/services/interfaces";

interface FeaturedArticleProps {
  article: NewsArticle;
}

const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  const { t } = useTranslation();
  const { id, title, summary, imageUrl, publishDate, author, tags } = article;

  const formattedDate = new Date(publishDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="mb-8 sm:mb-12 bg-gradient-to-br py-0 from-indigo-50 to-purple-50 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative flex flex-col lg:flex-row h-auto sm:h-[550px] lg:h-[400px]">
        <div className="lg:w-3/5 max-lg:h-1/2 rounded-xl lg:h-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        <CardContent className="lg:w-2/5 max-lg:h-1/2 p-4 sm:p-6 lg:p-8 flex flex-col h-full">
          <div className="mb-2 sm:mb-3 flex flex-wrap gap-2 items-center">
            <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
              {t("news.featured")}
            </span>
            {tags.length > 0 && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                #{tags[0]}
              </span>
            )}
          </div>

          <CardHeader className="p-0 space-y-2 sm:space-y-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 line-clamp-2">
              {title}
            </h2>

            <p className="text-sm sm:text-base text-gray-700 line-clamp-2 sm:line-clamp-3">
              {summary}
            </p>
          </CardHeader>

          <CardFooter className="p-0 mt-auto pt-4 flex flex-col justify-between sm:flex-row sm:items-center gap-4">
            <div className="flex justify-between w-full sm:w-auto items-center text-xs sm:text-sm text-gray-600">
              <span className="mr-4">{formattedDate}</span>
              <span className="truncate max-w-[150px]">{author}</span>
            </div>

            <ReadMoreButton articleId={id} />
          </CardFooter>
        </CardContent>
      </div>
    </Card>
  );
};

export default FeaturedArticle;
