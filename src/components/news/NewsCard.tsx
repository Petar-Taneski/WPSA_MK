import { Link } from "react-router-dom";
import { NewsArticle } from "../../services/api";
import ReadMoreButton from "../common/ReadMoreButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard = ({ article }: NewsCardProps) => {
  const { id, title, summary, thumbnailUrl, publishDate, author, tags } =
    article;

  const formattedDate = new Date(publishDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link to={`/news/${id}`} className="block h-full">
      <Card className="group h-full transition-all duration-300 hover:shadow-xl pt-0 overflow-clip hover:-translate-y-1">
        <div className="relative rounded-xl overflow-hidden">
          <div className="h-48">
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {tags.length > 0 && (
            <div className="absolute right-3 top-3 flex max-w-[70%] flex-wrap justify-end gap-1">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block rounded-md bg-indigo-600 px-2 py-1 text-xs font-medium text-white shadow-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="absolute bottom-3 left-3">
            <span className="inline-block rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
              {formattedDate}
            </span>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="line-clamp-2 text-xl group-hover:text-indigo-600">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="line-clamp-3 flex-grow text-gray-600">{summary}</p>
        </CardContent>

        <CardFooter className="mt-auto border-t flex justify-between border-gray-100 pt-4">
          <span className="text-xs text-gray-500 italic truncate max-w-[60%]">
            {author}
          </span>
          <ReadMoreButton articleId={id} />
        </CardFooter>
      </Card>
    </Link>
  );
};

export default NewsCard;
