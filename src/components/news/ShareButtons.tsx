import React from "react";
import { Facebook, Twitter, Linkedin, Link } from "lucide-react";

const ShareButtons: React.FC<{ url: string; title: string }> = ({
  url,
  title,
}) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-col items-center my-8">
      <h3 className="text-lg font-medium mb-4">Share this article</h3>
      <div className="flex space-x-4">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          aria-label="Share on Facebook"
        >
          <Facebook size={20} />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500"
          aria-label="Share on Twitter"
        >
          <Twitter size={20} />
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-blue-800 text-white rounded-full hover:bg-blue-900"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={20} />
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
          }}
          className="p-3 bg-gray-600 text-white rounded-full hover:bg-gray-700"
          aria-label="Copy link"
        >
          <Link size={20} />
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
