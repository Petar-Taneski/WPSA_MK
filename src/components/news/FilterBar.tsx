import { useRef, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNews } from "../../contexts/NewsContext";

const FilterBar = () => {
  const { t } = useTranslation();
  const { activeFilter, setActiveFilter, allTags } = useNews();

  const tagsContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setActiveFilter(value);
  };

  return (
    <div className="md:sticky top-[13vh] z-10 bg-white/90 backdrop-blur-sm py-8 border-gray-100">
      <div className="flex items-center justify-center gap-4 px-4 md:gap-8 md:px-0">
        <div
          ref={tagsContainerRef}
          className="flex-shrink-0 hidden gap-2 md:flex"
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

          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-3 py-1 text-sm rounded transition-colors whitespace-nowrap ${
                activeFilter === tag
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="block w-full max-w-xs md:hidden">
          <select
            value={activeFilter === null ? "" : activeFilter}
            onChange={handleSelectChange}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            aria-label={t("news.filterByCategory")}
          >
            <option value="">{t("news.allTopics")}</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
