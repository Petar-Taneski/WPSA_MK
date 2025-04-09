import React from "react";
import { useTranslation } from "react-i18next";

interface PostMetadataProps {
  author: string;
  publishDate: string;
  tags: string[];
}

const PostMetadata: React.FC<PostMetadataProps> = ({
  author,
  publishDate,
  tags,
}) => {
  const { t } = useTranslation();

  const formattedDate = new Date(publishDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-wrap gap-4 mb-8 p-2 pb-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-600">{t("post.author")}:</span>{" "}
        {author}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-600">{t("post.published")}:</span>{" "}
        {formattedDate}
      </div>
      {tags.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-600">{t("post.tags")}:</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 px-2 py-1 rounded-md text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostMetadata;
