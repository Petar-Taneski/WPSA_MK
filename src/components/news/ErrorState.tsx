import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  message: string | null;
}

const ErrorState = ({ message }: ErrorStateProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto text-center py-16 px-4">
      <div className="bg-red-50 p-8 rounded-lg border border-red-100">
        <svg
          className="w-16 h-16 text-red-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {message || t("news.articleNotFound")}
        </h2>
        <p className="text-gray-600 mb-6">{t("news.tryAgainLater")}</p>
        <button
          onClick={() => navigate("/news")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          {t("news.backToNews")}
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
