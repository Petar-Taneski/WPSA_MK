import React from "react";

interface PostContentProps {
  content: string;
}

const PostContent: React.FC<PostContentProps> = ({ content }) => {
  return (
    <div className="p-4">
      <div
        className="prose prose-lg max-w-3xl mx-auto"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default PostContent;
