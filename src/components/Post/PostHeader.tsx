import React from "react";

interface PostHeaderProps {
  title: string;
  imageUrl: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ title, imageUrl }) => {
  return (
    <div className="relative mb-6 overflow-hidden md:mb-12">
      <div className="relative flex flex-col md:flex-row">
        {/* Text container - desktop: styled overlay with position, mobile: simple text below image */}
        <div className="w-full md:w-[40vw] z-10 md:absolute md:top-1/2 md:-translate-y-1/2 md:left-[calc(15%-10vw)] md:p-4">
          {/* On desktop: styled overlay, on mobile: simple text */}
          <div className="w-full p-0 pt-4 md:p-6 md:rounded-lg md:shadow-lg md:bg-black/50 md:backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-gray-800 md:text-4xl md:text-white">
              {title}
            </h1>
          </div>
        </div>

        {/* Image container - takes right 3/5th on desktop, full width on mobile */}
        <div className="w-full md:w-5/7 md:ml-auto h-[250px] md:h-[400px] overflow-hidden rounded-md order-first md:order-none">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
