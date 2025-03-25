import React from "react";

const Hero = () => {
  return (
    <div>
      {/* Parallax background div - full screen width */}
      <div
        className="parallax"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        {/* Content overlay */}
        <div className="h-full min-h-screen flex items-center justify-center text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                Free Range Farming
              </h1>
              <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
                Natural and sustainable poultry farming
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
