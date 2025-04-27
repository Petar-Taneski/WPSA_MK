import { EXECUTIVES } from "@/utils/consts";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ExpandedProfileCard from "./ExpandedProfileCard";

interface Executive {
  firstName: string;
  lastName: string;
  role: string;
  image: string;
  bio: string;
}

const Leadership = () => {
  const { t } = useTranslation();
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(
    null
  );

  const handleCardClick = (executive: Executive) => {
    setSelectedExecutive(executive);
  };

  const handleCloseExpandedCard = () => {
    setSelectedExecutive(null);
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-primary mb-12 border-l-4 border-primary pl-4">
        {t("about.leadership.title")}
      </h3>
      <div className="flex flex-wrap justify-center gap-8">
        {EXECUTIVES.map((executive) => (
          <div
            key={executive.firstName}
            onClick={() => handleCardClick(executive as Executive)}
            className="flex flex-col h-fit w-58 p-4 justify-center items-center hover:shadow-lg shadow-sm transition-shadow duration-300 cursor-pointer"
          >
            <div className="mb-4 w-32 h-32 rounded-full overflow-hidden">
              <img
                src={executive.image}
                alt={`${t(executive.firstName)} ${t(executive.lastName)}`}
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${t(
                    executive.firstName
                  )}+${t(
                    executive.lastName
                  )}&background=6366f1&color=fff&size=250`;
                }}
              />
            </div>
            <div className="text-center">
              <h4 className="font-medium text-xl text-primary">
                {t(executive.firstName)}
              </h4>
              <h4 className="font-medium text-xl text-primary mb-2">
                {t(executive.lastName)}
              </h4>
              <p className="text-md text-gray-600/70">{t(executive.role)}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedExecutive && (
        <ExpandedProfileCard
          firstName={t(selectedExecutive.firstName)}
          lastName={t(selectedExecutive.lastName)}
          role={t(selectedExecutive.role)}
          image={selectedExecutive.image}
          bio={
            t(selectedExecutive.bio, { returnObjects: true }) as Record<
              string,
              string
            >
          }
          onClose={handleCloseExpandedCard}
        />
      )}
    </div>
  );
};

export default Leadership;
