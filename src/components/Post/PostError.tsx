import React from "react";
import { useNavigate } from "react-router-dom";

interface PostErrorProps {
  message: string | null;
}

const PostError: React.FC<PostErrorProps> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Article
        </h2>
        <p className="mb-6 text-gray-700">
          {message || "An error occurred while loading the article."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PostError;
