import React from "react";
import { SearchX } from "lucide-react";

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-6">
        <SearchX className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No articles found
      </h3>
      <p className="mt-1 text-gray-500">
        Try a different search term or filter
      </p>
    </div>
  );
};

export default EmptyState;
