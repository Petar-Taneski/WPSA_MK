import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.bubble.css";

interface PostContentProps {
  content: string;
}

const PostContent: React.FC<PostContentProps> = ({ content }) => {
  return (
    <div className="md:px-4">
      <div className="max-w-3xl prose prose-lg " />
      <ReactQuill
        theme="bubble"
        readOnly={true}
        value={content}
        className="px-4 custom-quill"
      />
    </div>
  );
};

export default PostContent;
