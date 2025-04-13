import React from "react";

const PostLoading: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-lg text-gray-600">Loading article...</p>
    </div>
  );
};

export default PostLoading;
