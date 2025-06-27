import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ReadMoreButtonProps {
  articleId: string;
  className?: string;
}

const ReadMoreButton = ({ articleId, className = "" }: ReadMoreButtonProps) => {
  const { t, i18n } = useTranslation();

  const getPostUrl = () => {
    const currentLanguage = i18n.language;
    return currentLanguage === "mk"
      ? `/mk/вести/${articleId}`
      : `/en/news/${articleId}`;
  };

  return (
    <a
      href={getPostUrl()}
      className={`pl-2 pr-1.5 py-2 flex gap-2 items-center cursor-pointer border-b-[1.5px] hover:border-primary border-transparent text-primary text-sm sm:text-base no-underline ${className}`}
    >
      {t("news.readMore")}
      <ArrowRight className="w-4 h-4" />
    </a>
  );
};

export default ReadMoreButton;
