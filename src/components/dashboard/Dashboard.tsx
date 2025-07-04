import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/providers/auth";
import { toast } from "react-toastify";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Calendar,
  MapPin,
  AlertCircle,
} from "lucide-react";
import {
  deleteNewsArticle,
  deleteEvent,
  fetchAllNewsArticles,
  fetchAllEvents,
} from "@/services/api";
import { NewsArticle, Event } from "@/services/interfaces";
import { NewsForm } from "./NewsForm";
import { EventForm } from "./EventForm";

type TabType = "news" | "events";
type ViewType = "list" | "create" | "edit";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State management
  const [activeTab, setActiveTab] = useState<TabType>("news");
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [loading, setLoading] = useState(false);

  // Data states
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [editingItem, setEditingItem] = useState<NewsArticle | Event | null>(
    null
  );

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "news") {
        const { items } = await fetchAllNewsArticles();
        setNewsArticles(items);
      } else {
        const { items } = await fetchAllEvents();
        setEvents(items);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error(t("dashboard.loadError", "Failed to load data"));
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (item: NewsArticle | Event) => {
    if (
      !window.confirm(
        t(
          "dashboard.confirmDelete",
          "Are you sure you want to delete this item?"
        )
      )
    ) {
      return;
    }

    try {
      if ("author" in item) {
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

  // Handle edit
  const handleEdit = (item: NewsArticle | Event) => {
    setEditingItem(item);
    if ("author" in item) {
      setActiveTab("news");
    } else {
      setActiveTab("events");
    }
    setCurrentView("edit");
  };

  // Handle success (create/update)
  const handleSuccess = () => {
    setCurrentView("list");
    setEditingItem(null);
    loadData();
  };

  // Handle cancel
  const handleCancel = () => {
    setCurrentView("list");
    setEditingItem(null);
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-600">
          {t(
            "dashboard.notAuthenticated",
            "Please log in to access the dashboard"
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
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

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {currentView === "list" && (
          <div className="p-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab === "news"
                  ? t("dashboard.newsArticles", "News Articles")
                  : t("dashboard.events", "Events")}
              </h2>
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
                {(activeTab === "news" ? newsArticles : events).map((item) => (
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
                ))}

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
  );
};

export default Dashboard;
