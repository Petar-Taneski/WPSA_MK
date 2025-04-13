import { useRef, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNews } from "../../contexts/NewsContext";

// Define fixed categories
const newsCategories = [
  "Webinars",
  "Courses",
  "Education and training",
  "WPSA Events",
];

const SearchFilterBar = () => {
  const { t } = useTranslation();
  const { activeFilter, setActiveFilter } = useNews();

  const tagsContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setActiveFilter(value === "" ? null : value);
  };

  return (
    <div className="sticky top-[13vh] max-md:top-[15vh] z-10 bg-white/90 backdrop-blur-sm py-8 border-gray-100">
      <div className="flex justify-center items-center gap-4 md:gap-8 px-4 md:px-0">
        <div
          ref={tagsContainerRef}
          className="hidden md:flex flex-shrink-0 gap-2"
        >
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1 text-sm rounded transition-colors whitespace-nowrap ${
              activeFilter === null
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t("news.allTopics")}
          </button>

          {newsCategories.map((category: string) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-3 py-1 text-sm rounded transition-colors whitespace-nowrap ${
                activeFilter === category
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="block md:hidden w-full max-w-xs">
          <select
            value={activeFilter === null ? "" : activeFilter}
            onChange={handleSelectChange}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            aria-label={t("news.filterByCategory")}
          >
            <option value="">{t("news.allTopics")}</option>
            {newsCategories.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
