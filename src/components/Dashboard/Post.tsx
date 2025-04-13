import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const Post = () => {
  const [content, setContent] = useState("");
  const [isSaved, setIsSaved] = useState(true);

  // Load content from local storage on component mount
  useEffect(() => {
    const savedContent = localStorage.getItem("post-content");
    if (savedContent !== null) {
      setContent(savedContent);
    }
  }, []);

  const handleChange = (value: string) => {
    setContent(value);
    setIsSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("post-content", content);
    setIsSaved(true);
  };

  const handleClear = () => {
    setContent("");
    localStorage.removeItem("post-content");
    setIsSaved(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Create Post</h2>
      <div className="mb-4">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleChange}
          className="min-h-[200px] mb-4"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`px-4 py-2 rounded ${
            isSaved ? "bg-gray-400" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isSaved ? "Saved" : "Save to Device"}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Post;
