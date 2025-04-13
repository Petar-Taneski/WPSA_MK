import React from "react";
import { formatDate } from "../../utils/dateUtils";

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
  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="flex flex-col md:flex-row justify-between border-t border-b border-gray-200 py-4">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-gray-600">Author:</span>{" "}
          <span className="text-gray-800">{author}</span>
        </div>

        <div className="mb-4 md:mb-0">
          <span className="font-bold text-gray-600">Published:</span>{" "}
          <span className="text-gray-800">{formatDate(publishDate)}</span>
        </div>

        {tags && tags.length > 0 && (
          <div>
            <span className="font-bold text-gray-600">Tags:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostMetadata;
