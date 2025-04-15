import { Link } from "react-router-dom";
import { useState } from "react";
import OpenHeader from "./OpenHeader";
import { toTop } from "@/lib/utils";

// Define props interface
interface MobileHeaderProps {
  openContactModal: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ openContactModal }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      toTop();
    }
  };

  return (
    <div className="fixed top-0 w-full flex items-end justify-center h-[15vh] z-[1000] bg-white">
      <div className="flex items-center justify-between w-full h-fit z-[1001] pb-[20px] border-b-[0.5px] border-b-white border-opacity-50 px-[5vw]">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="mobile-m:scale-[1.30] mobile-m:translate-x-[15%]"
        >
          <img src="/Logo-WPSA.png" alt="WPSA logo" className="w-[15vw]" />
        </Link>
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="relative mobile-m:scale-[1.30] mobile-m:-translate-x-[15%] cursor-pointer"
        >
          <img
            src="/header-x.svg"
            alt="Close button"
            className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          />
          <img
            src="/header-lines.svg"
            alt="Open button"
            className={`transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
        </button>
      </div>
      <OpenHeader
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        openContactModal={openContactModal}
      />
    </div>
  );
};

export default MobileHeader;
