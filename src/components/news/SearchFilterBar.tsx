import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useNews } from "../../contexts/NewsContext";
import { Search, Grid, List } from "lucide-react";
import { Button } from "../ui/button";

const SearchFilterBar = () => {
  const { t } = useTranslation();
  const {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    viewMode,
    setViewMode,
    allTags,
  } = useNews();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  // Handle click outside search to unfocus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-4 border-b overflow-x-auto no-scrollbar px-0.5 border-gray-100 mb-8">
      <div className="flex flex-col md:flex-row items-center min-w-fit gap-4">
        {/* TODO: figure out what to do with the tags */}
        <div
          ref={searchRef}
          className={`relative transition-all duration-300 h-10 flex ease-in-out ${
            isSearchFocused ? "w-[200px]" : "w-[40px]"
          }`}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder={t("news.searchPlaceholder")}
            className="w-full py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex w-full items-center gap-4 md:w-auto">
          {/* View toggle */}
          <div className="flex shrink-0 rounded-lg bg-gray-100 p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-2 ${
                viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-600"
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={`rounded-md p-2 ${
                viewMode === "list" ? "bg-white shadow-sm" : "text-gray-600"
              }`}
              aria-label="List view"
            >
              <List className="h-5 w-5" />
            </Button>
          </div>

          <div className="hidden shrink-0 text-gray-400 md:block">|</div>

          {/* Tag filters with horizontal scrolling */}
          <div
            ref={tagsContainerRef}
            className="-mb-1 flex flex-shrink-0 gap-2 overflow-x-auto pb-1"
          >
            <Button
              variant={activeFilter === null ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveFilter(null)}
              className="rounded-full px-4"
            >
              {t("news.allTopics")}
            </Button>

            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={activeFilter === tag ? "default" : "secondary"}
                size="sm"
                onClick={() => setActiveFilter(tag)}
                className="rounded-full px-4"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
