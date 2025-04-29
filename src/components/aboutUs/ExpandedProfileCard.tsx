import React, { useEffect } from "react";

interface ExpandedProfileCardProps {
  firstName: string;
  lastName: string;
  role: string;
  image: string;
  bio: Record<string, string>;
  onClose: () => void;
}

const ExpandedProfileCard: React.FC<ExpandedProfileCardProps> = ({
  firstName,
  lastName,
  role,
  image,
  bio,
  onClose,
}) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=6366f1&color=fff&size=250`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/15 flex justify-center items-center p-4"
      style={{ zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-sm shadow-primary h-11/12 p-8 pr-0 max-w-2xl w-full relative transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row items-center h-full md:items-start gap-4 md:gap-8">
          <div className="h-full md:flex-shrink-0 max-md:h-1/4 max-md:mr-8 md:mb-0">
            <img
              src={image}
              alt={`${firstName} ${lastName}`}
              className="w-40 h-40 max-md:w-32 max-md:h-32 rounded-full object-cover shadow-md"
              onError={handleImageError}
            />
          </div>

          <div className="text-center md:text-left h-full max-md:h-3/4 flex flex-col">
            <h2 className="text-3xl max-sm:text-2xl max-md:mr-8 font-bold text-primary pb-1">
              {firstName} {lastName}
            </h2>
            <p className="text-lg max-sm:text-lg max-md:mr-8 text-primary font-medium">
              {role}
            </p>
            <div className="border-gray-200 border-b pt-4 mr-8" />
            <div className="pt-4 overflow-y-auto h-full pr-8">
              <h4 className="text-xl font-semibold  text-gray-800 mb-2">Bio</h4>
              {Object.values(bio).map((paragraph, index) => (
                <p
                  key={index}
                  className="text-md text-gray-600 text-justify leading-relaxed mb-3 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedProfileCard;
