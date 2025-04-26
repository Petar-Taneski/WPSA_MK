import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import OpenHeader from "./OpenHeader";
import { toTop } from "@/lib/utils";
import { useTranslation } from "react-i18next";

// Define props interface
interface MobileHeaderProps {
  openContactModal: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ openContactModal }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const { t } = useTranslation();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      toTop();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const headerHeight = window.innerHeight * 0.15; // 15vh in pixels

      // If menu is open, always show header
      if (isOpen) {
        setIsVisible(true);
        setScrollPosition(currentScrollPos);
        return;
      }

      // Only hide header if we've scrolled more than its height (15vh)
      const isScrollingDown = currentScrollPos > scrollPosition;
      setIsVisible(!isScrollingDown || currentScrollPos < headerHeight);

      // Update position for next comparison
      setScrollPosition(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition, isOpen]);

  return (
    <div
      className={`fixed top-0 w-full flex items-end justify-center h-[15vh] min-h-[80px] z-[1000] bg-white transition-transform duration-300 ${
        isVisible || isOpen ? "transform-none" : "transform -translate-y-full"
      }`}
    >
      <div className="realtive flex items-center justify-between w-full h-fit z-[1001] pb-[15px] pt-[10px] border-b-[0.5px] border-b-white border-opacity-50 px-[5vw]">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="mobile-m:scale-[1.30] mobile-m:translate-x-[15%] tablet:scale-100 tablet:translate-x-0"
        >
          <img src="/Logo-WPSA.png" alt="WPSA logo" className="w-[70px]" />
        </Link>
        <div className="flex-1 mx-2 text-center">
          <p className="pr-[20px] text-xs font-medium sm:text-sm md:text-base line-clamp-2 sm:line-clamp-1 text-end">
            {`${t("about.nameFirstPart")} ${t("about.nameSecondPart")}`}
          </p>
        </div>

          
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="relative mobile-m:scale-[1.30] mobile-m:-translate-x-[15%] tablet:scale-100 tablet:translate-x-0 cursor-pointer"
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
