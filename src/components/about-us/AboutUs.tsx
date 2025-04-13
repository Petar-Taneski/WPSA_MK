import React from "react";
import Goals from "./Goals";
import Leadership from "./Leadership";
import Membership from "./Membership";
import MissionVision from "./MissionVision";
import Partners from "./Partners";

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">WPSA</h1>
        <h2 className="text-2xl md:text-3xl text-gray-700">
          WORLD POULTRY SCIENCE ASSOCIATION - MACEDONIAN BRANCH
        </h2>
      </div>

      <div className="flex flex-col gap-20">
        <Goals />
        <MissionVision />
        <Leadership />
        <Membership />
        <Partners />
      </div>
    </div>
  );
};

export default AboutUs;
