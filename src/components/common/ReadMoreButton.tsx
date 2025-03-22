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
      className={`text-indigo-600 font-medium hover:text-indigo-800 transition-colors whitespace-nowrap ${className}`}
    >
      {t("news.readMore")}
      <ArrowRight className="w-4 h-4" />
    </Button>
  );
};

export default ReadMoreButton;
