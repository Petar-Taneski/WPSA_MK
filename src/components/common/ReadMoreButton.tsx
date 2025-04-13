import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface ReadMoreButtonProps {
  articleId: string;
  className?: string;
}

const ReadMoreButton = ({ articleId, className = "" }: ReadMoreButtonProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleClick = () => {
    const currentLanguage = i18n.language;
    const path =
      currentLanguage === "mk"
        ? `/mk/вести/${articleId}`
        : `/en/news/${articleId}`;
    navigate(path);
  };

  return (
    <button
      onClick={handleClick}
      className={`pl-2 pr-1.5 py-2 flex gap-2 items-center cursor-pointer border-b-2 hover:border-primary border-transparent text-primary text-sm sm:text-base ${className}`}
    >
      {t("news.readMore")}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
};

export default ReadMoreButton;
