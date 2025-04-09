import React from "react";
import { useTranslation } from "react-i18next";

interface PostHeaderProps {
  title: string;
  imageUrl: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ title, imageUrl }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 mb-8 p-4">
      <div className="flex-1">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto max-h-[400px] object-cover rounded-lg"
        />
      </div>
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
      </div>
    </div>
  );
};

export default PostHeader;
