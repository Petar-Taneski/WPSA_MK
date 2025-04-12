import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.bubble.css";

interface PostContentProps {
  content: string;
}

const PostContent: React.FC<PostContentProps> = ({ content }) => {
  return (
    <div className="px-4">
      <div className="prose prose-lg max-w-3xl " />
      <ReactQuill
        theme="bubble"
        readOnly={true}
        value={content}
        className="custom-quill px-4"
      />
    </div>
  );
};

export default PostContent;
