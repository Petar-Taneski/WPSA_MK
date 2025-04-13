import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ReadMoreButtonProps {
  articleId: string;
}

const ReadMoreButton: React.FC<ReadMoreButtonProps> = ({ articleId }) => {
  return (
    <Link
      to={`/news/${articleId}`}
      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
    >
      <span>Read more</span>
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
};

export default ReadMoreButton;
