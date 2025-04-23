import React from "react";
import ContactInfo from "../ContactInfo";

const Footer: React.FC = () => {
  return (
    <footer className="w-[90vw] mx-auto bg-white mt-auto">
      <div className="w-[90vw] h-[1px] mx-auto bg-gray-800/15"></div>
      <ContactInfo />
    </footer>
  );
};

export default Footer;
