import React from "react";
import { useTranslation } from "react-i18next";
import { parseDateString } from "@/lib/utils";

interface PostMetadataProps {
  author?: string;
  publishDate: string;
  tags?: string[];
}

const PostMetadata: React.FC<PostMetadataProps> = ({
  author,
  publishDate,
  tags,
}) => {
  const { t } = useTranslation();

  const parsedDate = parseDateString(publishDate);
  const formattedDate = parsedDate
    ? parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : publishDate;

  return (
    <div className="flex flex-wrap gap-4 md:p-4 md:pb-4">
      {author && author.trim() !== "" && (
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-600">{t("post.author")}:</span>{" "}
          {author}
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-600">{t("post.published")}:</span>{" "}
        {formattedDate}
      </div>
      {Array.isArray(tags) &&
        tags.length > 0 &&
        tags.some((tag) => tag && tag.trim() !== "") && (
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-600">{t("post.tags")}:</span>
            <div className="flex flex-wrap gap-2">
              {tags
                .filter((tag) => tag && tag.trim() !== "")
                .map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm bg-gray-100 rounded-md"
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
