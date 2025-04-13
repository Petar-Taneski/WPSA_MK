import React from "react";

const Goals: React.FC = () => {
  const goalPoints = [
    "Promotion of advancement of knowledge in all aspects of poultry science and the poultry industry",
    "Promotion of World Poultry Congresses, as well as local and regional meetings",
    "Organizing professional and scientific gatherings through lectures, public appearances, round tables, forums, and other appropriate means",
    "Informing the public about the activities of the Association through social networks and other methods",
    "Development and implementation of scientific national and international projects in the field of poultry",
    "Dissemination of knowledge in all branches of the poultry industry and facilitating the exchange of economic activities of the Association through organizing scientific meetings, seminars, and lectures, as well as publishing activities",
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Goals of the Association
      </h2>
      <p className="text-gray-700 mb-8">
        The Association primarily focuses on the concept of economically
        acceptable and sustainable development and adapted concept for the
        protection, promotion, and development of poultry science and the
        poultry industry. The Association will promote all theoretical knowledge
        and practical experiences that help realize and advance the basic goals
        and tasks.
      </p>
      <div className="bg-gray-50 p-6 rounded-lg">
        <ul className="space-y-4">
          {goalPoints.map((point, index) => (
            <li key={index} className="flex">
              <span className="text-indigo-600 mr-3">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Goals;
