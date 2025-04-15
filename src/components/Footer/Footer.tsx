import React from "react";
import LowerSection from "./LowerSection";

interface FooterProps {
  openContactModal: () => void;
}

const Footer: React.FC<FooterProps> = ({ openContactModal }) => {
  return (
    <div className="flex flex-col items-center w-screen text-gray-800/85">
      <div className="w-[90vw] h-[1px] bg-gray-800/15"></div>
      <LowerSection openContactModal={openContactModal} />
    </div>
  );
};

export default Footer;
