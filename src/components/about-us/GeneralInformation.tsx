import { useTranslation } from "react-i18next";

// Executive team data
const executives = [
  {
    name: "Aleksandar Dodovski",
    image: "/images/executives/dodovski.jpg",
    role: "President",
  },
  {
    name: "Tanja Kolevska",
    image: "/images/executives/kolevska.jpg",
    role: "Executive Board",
  },
  {
    name: "Aleksandar Dovlev",
    image: "/images/executives/dovlev.jpg",
    role: "Executive Board",
  },
  {
    name: "Marjan Tanevski",
    image: "/images/executives/tanevski.jpg",
    role: "Executive Board",
  },
  {
    name: "Milan Popchevski",
    image: "/images/executives/popchevski.jpg",
    role: "Executive Board",
  },
];

const GeneralInformation = () => {
  const { t } = useTranslation();

  return (
    <section className="general-information max-w-7xl mx-auto">
      {/* Organization Name and About Section */}
      <header className="mb-24 py-16 border-b border-gray-200">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          {t("about.generalInfo.title")}
        </h2>
        <h3 className="text-2xl font-medium text-gray-700 max-w-4xl">
          {t("about.name")}
        </h3>
      </header>

      {/* Goals Section */}
      <div className="mb-24 flex gap-8">
        <div className="md:col-span-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-indigo-500 pl-4">
            {t("about.goals.title")}
          </h3>
          <p className="text-gray-700 leading-relaxed mb-8">
            {t("about.goals.description")}
          </p>

          <ul className="space-y-6 border-l border-gray-200 pl-6">
            {Object.entries({
              advancement: "✓",
              congresses: "✓",
              gatherings: "✓",
              informing: "✓",
              projects: "✓",
              dissemination: "✓",
            }).map(([key, icon]) => (
              <li key={key} className="flex items-start">
                <span className="text-indigo-600 font-bold text-lg mr-3">
                  {icon}
                </span>
                <span className="text-gray-700 leading-tight">
                  {t(`about.goals.points.${key}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        
      </div>

      {/* Mission and Vision Section */}
      <div className="mb-32 py-16 border-y border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-12 border-l-4 border-indigo-500 pl-4">
          {t("about.mission.title")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="border-l-2 border-indigo-100 pl-8">
            <h4 className="text-xl font-bold text-indigo-700 mb-4">
              {t("about.mission.visionLabel")}
            </h4>
            <p className="text-gray-700 text-lg">{t("about.mission.vision")}</p>
          </div>

          <div className="border-l-2 border-indigo-100 pl-8">
            <h4 className="text-xl font-bold text-indigo-700 mb-4">
              {t("about.mission.missionLabel")}
            </h4>
            <p className="text-gray-700 text-lg">
              {t("about.mission.mission")}
            </p>
          </div>
        </div>
      </div>

      {/* Full Width Image Section - Kept the same as requested */}
      <div className="relative w-full h-[50vh] mb-32 overflow-hidden">
        <img
          src="/images/about/chickens.jpg"
          alt="Chickens eating grain"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 w-full h-full flex items-center justify-center">
          <div className="text-center p-12 w-full h-full backdrop-blur-xs items-center justify-center flex bg-white/10">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-5 md:self-center">
                  <h2 className="text-3xl text-white mb-6">
                    {t("about.shortName")}
                  </h2>
                </div>
                <div className="md:col-span-7">
                  <p className="text-white text-lg leading-relaxed p-6 border-l-2 border-gray-200">
                    {t("about.partners.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Section */}
      <div className="mb-24 py-12 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-12 border-l-4 border-indigo-500 pl-4">
          {t("about.leadership.title")}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {executives.map((executive, index) => (
            <div key={index} className="flex flex-col">
              <div className="mb-4 w-full aspect-square overflow-hidden">
                <img
                  src={executive.image}
                  alt={executive.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${executive.name.replace(
                      / /g,
                      "+"
                    )}&background=6366f1&color=fff&size=250`;
                  }}
                />
              </div>
              <h4 className="font-bold text-gray-800">{executive.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Membership Section */}
      <div className="mb-24">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-indigo-500 pl-4">
          {t("about.membership.title")}
        </h3>
        <p className="text-gray-700 leading-relaxed mb-12 max-w-4xl border-l border-gray-200 pl-6">
          {t("about.membership.description")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-12">
          {Object.entries({
            regular: {
              icon: "👤",
              color: "border-indigo-200",
            },
            student: {
              icon: "🎓",
              color: "border-emerald-200",
            },
            honorary: {
              icon: "🏆",
              color: "border-amber-200",
            },
            associate: {
              icon: "🏢",
              color: "border-violet-200",
            },
          }).map(([key, { icon, color }]) => (
            <div key={key} className={`p-8 border-l-4 ${color}`}>
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-4">{icon}</span>
                <h4 className="text-xl font-bold text-gray-800">
                  {t(`about.membership.types.${key}.title`)}
                </h4>
              </div>
              <p className="text-gray-700">
                {t(`about.membership.types.${key}.description`)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-l-4 border-gray-200 pl-6 py-4 text-gray-700">
          {t("about.membership.fee")}
        </div>
      </div>
    </section>
  );
};

export default GeneralInformation;
