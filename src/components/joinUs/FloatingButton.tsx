import { PlusIcon } from "lucide-react";
import React from "react";

const FloatingButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed group bottom-4 right-4 z-[1000] w-14 h-14 bg-white bg-radial from-white via-white/50 to-primary text-primary rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300"
    aria-label="Open Join Us Modal"
  >
    <PlusIcon className="w-5 h-5 group-hover:-rotate-90 transition-all duration-300" />
  </button>
);

export default FloatingButton;
