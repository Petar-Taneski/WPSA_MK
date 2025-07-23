import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/providers/auth";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Calendar,
  MapPin,
  Link2,
} from "lucide-react";
import {
  fetchAllNewsArticles,
  deleteNewsArticle,
  fetchAllEvents,
  deleteEvent,
} from "@/services/api";
import { NewsArticle, Event } from "@/services/interfaces";
import { NewsForm } from "./NewsForm";
import { EventForm } from "./EventForm";
import { toast } from "react-toastify";

type TabType = "news" | "events";
type ViewType = "list" | "create" | "edit";
type LanguageFilter = "all" | "english" | "macedonian";

export const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("news");
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("all");
  const [editingItem, setEditingItem] = useState<NewsArticle | Event | null>(
    null
  );

  // Load data based on active tab and language filter
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [activeTab, languageFilter, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "news") {
        const langParam =
          languageFilter === "all"
            ? undefined
            : languageFilter === "english"
            ? "en"
            : "mk";
        const { items } = await fetchAllNewsArticles(langParam);
        setNewsArticles(items);
      } else {
        const langParam =
          languageFilter === "all"
            ? undefined
            : languageFilter === "english"
            ? "en"
            : "mk";
        const { items } = await fetchAllEvents(langParam);
        setEvents(items);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error(t("dashboard.loadError", "Failed to load data"));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: NewsArticle | Event) => {
    setEditingItem(item);
    setCurrentView("edit");
  };

  const handleDelete = async (item: NewsArticle | Event) => {
    if (!window.confirm(t("dashboard.confirmDelete", "Are you sure?"))) {
      return;
    }

    try {
      if (activeTab === "news") {
        await deleteNewsArticle(item.id);
        toast.success(
          t("dashboard.newsDeleted", "News article deleted successfully")
        );
      } else {
        await deleteEvent(item.id);
        toast.success(
          t("dashboard.eventDeleted", "Event deleted successfully")
        );
      }
      loadData();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(t("dashboard.deleteError", "Failed to delete item"));
    }
  };

  const handleSuccess = () => {
    setCurrentView("list");
    setEditingItem(null);
    loadData();
  };

  const handleCancel = () => {
    setCurrentView("list");
    setEditingItem(null);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("dashboard.title", "Content Management Dashboard")}
          </h2>
          <p className="text-gray-600">
            {t(
              "dashboard.notAuthenticated",
              "Please log in to access the dashboard"
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t("dashboard.title", "Content Management Dashboard")}
        </h1>
        <p className="text-gray-600">
          {t("dashboard.subtitle", "Manage your news articles and events")}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gray-100 p-1 rounded-lg flex">
          <button
            onClick={() => {
              setActiveTab("news");
              setCurrentView("list");
              setEditingItem(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "news"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText className="inline w-4 h-4 mr-2" />
            {t("dashboard.news", "News Articles")}
          </button>
          <button
            onClick={() => {
              setActiveTab("events");
              setCurrentView("list");
              setEditingItem(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "events"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Calendar className="inline w-4 h-4 mr-2" />
            {t("dashboard.events", "Events")}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {currentView === "list" && (
            <div className="p-6">
              {/* Action Bar */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {activeTab === "news"
                      ? t("dashboard.newsArticles", "News Articles")
                      : t("dashboard.events", "Events")}
                  </h2>

                  {/* Language Filter - Show for both news and events tabs */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {t("dashboard.filter", "Filter")}:
                    </span>
                    <div className="flex rounded-md border border-gray-300 overflow-hidden">
                      <button
                        onClick={() => setLanguageFilter("all")}
                        className={`px-3 py-1 text-sm transition-colors ${
                          languageFilter === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {t("dashboard.allItems", "All")}
                      </button>
                      <button
                        onClick={() => setLanguageFilter("english")}
                        className={`px-3 py-1 text-sm border-l border-gray-300 transition-colors ${
                          languageFilter === "english"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => setLanguageFilter("macedonian")}
                        className={`px-3 py-1 text-sm border-l border-gray-300 transition-colors ${
                          languageFilter === "macedonian"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        MK
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingItem(null);
                    setCurrentView("create");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("dashboard.createNew", "Create New")}
                </button>
              </div>

              {/* Items List */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">
                    {t("dashboard.loading", "Loading...")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(activeTab === "news" ? newsArticles : events).map(
                    (item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {item.summary}
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {item.lang === "english" ? "EN" : "MK"}
                              </span>
                              <span>{item.publishDate}</span>
                              {"location" in item && item.location && (
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {item.location}
                                </span>
                              )}
                              {"isFeatured" in item && item.isFeatured && (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                  Featured
                                </span>
                              )}
                              {activeTab === "news" &&
                                "correspondingId" in item &&
                                item.correspondingId && (
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center">
                                    <Link2 className="w-3 h-3 mr-1" />
                                    {t("dashboard.linked", "Linked")}
                                  </span>
                                )}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title={t("dashboard.edit", "Edit")}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title={t("dashboard.delete", "Delete")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {(activeTab === "news" ? newsArticles : events).length ===
                    0 && (
                    <div className="text-center py-8 text-gray-500">
                      {t(
                        "dashboard.noItems",
                        "No items found. Create your first one!"
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Forms */}
          {(currentView === "create" || currentView === "edit") &&
            activeTab === "news" && (
              <NewsForm
                editingItem={editingItem as NewsArticle | null}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            )}

          {(currentView === "create" || currentView === "edit") &&
            activeTab === "events" && (
              <EventForm
                editingItem={editingItem as Event | null}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
