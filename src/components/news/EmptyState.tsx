import { useTranslation } from "react-i18next";

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-16">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        ></path>
      </svg>
      <h3 className="mt-2 text-lg font-medium text-gray-900">
        {t("news.noArticlesFound")}
      </h3>
      <p className="mt-1 text-gray-500">{t("news.tryDifferentSearch")}</p>
    </div>
  );
};

export default EmptyState;
