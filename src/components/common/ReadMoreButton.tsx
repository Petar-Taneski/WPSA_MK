import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface ReadMoreButtonProps {
  articleId: string;
  className?: string;
}

const ReadMoreButton = ({ articleId, className = "" }: ReadMoreButtonProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    navigate(`/news/${articleId}`);
  };

  return (
    <Button
      onClick={handleClick}
      variant="default"
      className={` px-4 py-2  bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm sm:text-base transition-colors whitespace-nowrap ${className}`}
    >
      {t("news.readMore")}
      <ArrowRight className="w-4 h-4" />
    </Button>
  );
};

export default ReadMoreButton;
