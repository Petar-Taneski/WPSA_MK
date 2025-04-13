import { useTranslation } from "react-i18next";
import { EXECUTIVES } from "@/utils/consts";

const Leadership = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-2xl font-bold text-primary mb-12 border-l-4 border-primary pl-4">
        {t("about.leadership.title")}
      </h3>
      {/* TODO: make the grid responsive for mobile*/}
      <div className="grid grid-cols-2 md:grid-cols-5 h-fit gap-8">
        {EXECUTIVES.map((executive) => (
          <div
            key={executive.firstName}
            className="flex flex-col h-fit p-4 justify-center items-center"
          >
            <div className="mb-4 w-32 h-32 rounded-full overflow-hidden">
              <img
                src={executive.image}
                alt={`${t(executive.firstName)} ${t(executive.lastName)}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
    </div>
  );
};

export default Leadership;
