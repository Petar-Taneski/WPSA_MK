import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/providers/auth";
import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<TabType>("news");
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("all");
  const [editingItem, setEditingItem] = useState<NewsArticle | Event | null>(
    null
  );

  // Initialize and sync state from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = (params.get("tab") as TabType) || "news";
    const view = (params.get("view") as ViewType) || "list";
    const itemId = params.get("itemId");
    const filter = (params.get("filter") as LanguageFilter) || "all";

    // Always update state to match URL
    if (tab === "news" || tab === "events") {
      setActiveTab(tab);
    }
    if (view === "list" || view === "create" || view === "edit") {
      setCurrentView(view);
    }
    if (filter === "all" || filter === "english" || filter === "macedonian") {
      setLanguageFilter(filter);
    }

    // Handle editing item based on URL
    if (view === "edit" && itemId && user) {
      // We'll find and set the editing item after data loads
      // For now, just ensure we're in edit mode
    } else if (view !== "edit") {
      // Clear editing item if we're not in edit mode
      setEditingItem(null);
    }
  }, [location.search, user]);

  // Load data based on active tab and language filter
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [activeTab, languageFilter, user]);

  // Function to update URL with current state
  const updateURL = (
    tab: TabType,
    view: ViewType,
    itemId?: string,
    filter?: LanguageFilter,
    replace: boolean = false
  ) => {
    const params = new URLSearchParams();
    params.set("tab", tab);
    params.set("view", view);
    if (itemId) params.set("itemId", itemId);
    if (filter && filter !== "all") params.set("filter", filter);

    navigate(`/admin?${params.toString()}`, { replace });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      let items: (NewsArticle | Event)[] = [];
      if (activeTab === "news") {
        const langParam =
          languageFilter === "all"
            ? undefined
            : languageFilter === "english"
            ? "en"
            : "mk";
        const { items: newsItems } = await fetchAllNewsArticles(langParam);
        setNewsArticles(newsItems);
        items = newsItems;
      } else {
        const langParam =
          languageFilter === "all"
            ? undefined
            : languageFilter === "english"
            ? "en"
            : "mk";
        const { items: eventItems } = await fetchAllEvents(langParam);
        setEvents(eventItems);
        items = eventItems;
      }

      // Check if we need to restore an editing item from URL
      const params = new URLSearchParams(location.search);
      const itemId = params.get("itemId");
      const view = params.get("view");

      if (itemId && view === "edit" && items.length > 0) {
        const item = items.find((item) => item.id === itemId);
        if (item) {
          setEditingItem(item);
        } else {
          // Item not found, redirect to list view
          updateURL(activeTab, "list", undefined, languageFilter, true);
        }
      } else if (view !== "edit") {
        // Ensure editing item is cleared when not in edit mode
        setEditingItem(null);
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
    updateURL(activeTab, "edit", item.id, languageFilter);
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
    updateURL(activeTab, "list", undefined, languageFilter, true);
    loadData();
  };

  const handleCancel = () => {
    setCurrentView("list");
    setEditingItem(null);
    updateURL(activeTab, "list", undefined, languageFilter, true);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
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
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mx-auto mb-8 max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          {t("dashboard.title", "Content Management Dashboard")}
        </h1>
        <p className="text-gray-600">
          {t("dashboard.subtitle", "Manage your news articles and events")}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mx-auto mb-6 max-w-7xl">
        <div className="flex p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => {
              setActiveTab("news");
              setCurrentView("list");
              setEditingItem(null);
              updateURL("news", "list", undefined, languageFilter);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "news"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText className="inline mr-2 w-4 h-4" />
            {t("dashboard.news", "News Articles")}
          </button>
          <button
            onClick={() => {
              setActiveTab("events");
              setCurrentView("list");
              setEditingItem(null);
              updateURL("events", "list", undefined, languageFilter);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "events"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Calendar className="inline mr-2 w-4 h-4" />
            {t("dashboard.events", "Events")}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-7xl">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {currentView === "list" && (
            <div className="p-6">
              {/* Action Bar */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4 items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {activeTab === "news"
                      ? t("dashboard.newsArticles", "News Articles")
                      : t("dashboard.events", "Events")}
                  </h2>

                  {/* Language Filter - Show for both news and events tabs */}
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-600">
                      {t("dashboard.filter", "Filter")}:
                    </span>
                    <div className="flex overflow-hidden rounded-md border border-gray-300">
                      <button
                        onClick={() => {
                          setLanguageFilter("all");
                          updateURL(
                            activeTab,
                            currentView,
                            editingItem?.id,
                            "all"
                          );
                        }}
                        className={`px-3 py-1 text-sm transition-colors ${
                          languageFilter === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {t("dashboard.allItems", "All")}
                      </button>
                      <button
                        onClick={() => {
                          setLanguageFilter("english");
                          updateURL(
                            activeTab,
                            currentView,
                            editingItem?.id,
                            "english"
                          );
                        }}
                        className={`px-3 py-1 text-sm border-l border-gray-300 transition-colors ${
                          languageFilter === "english"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => {
                          setLanguageFilter("macedonian");
                          updateURL(
                            activeTab,
                            currentView,
                            editingItem?.id,
                            "macedonian"
                          );
                        }}
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
                    updateURL(activeTab, "create", undefined, languageFilter);
                  }}
                  className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
                >
                  <Plus className="mr-2 w-4 h-4" />
                  {t("dashboard.createNew", "Create New")}
                </button>
              </div>

              {/* Items List */}
              {loading ? (
                <div className="py-8 text-center">
                  <div className="mx-auto w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"></div>
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
                        className="p-4 rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="mb-1 font-semibold text-gray-800">
                              {item.title}
                            </h3>
                            <p className="mb-2 text-sm text-gray-600 line-clamp-2">
                              {item.summary}
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                              <span className="px-2 py-1 bg-gray-100 rounded">
                                {item.lang === "english" ? "EN" : "MK"}
                              </span>
                              <span>{item.publishDate}</span>
                              {"location" in item && item.location && (
                                <span className="flex items-center">
                                  <MapPin className="mr-1 w-3 h-3" />
                                  {item.location}
                                </span>
                              )}
                              {"isFeatured" in item && item.isFeatured && (
                                <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded">
                                  Featured
                                </span>
                              )}
                              {activeTab === "news" &&
                                "correspondingId" in item &&
                                item.correspondingId && (
                                  <span className="flex items-center px-2 py-1 text-xs text-green-700 bg-green-100 rounded">
                                    <Link2 className="mr-1 w-3 h-3" />
                                    {t("dashboard.linked", "Linked")}
                                  </span>
                                )}
                            </div>
                          </div>
                          <div className="flex ml-4 space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title={t("dashboard.edit", "Edit")}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-1 text-red-600 hover:text-red-800"
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
                    <div className="py-8 text-center text-gray-500">
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
