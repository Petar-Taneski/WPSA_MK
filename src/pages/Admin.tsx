import React, { useState } from "react";
import { toast } from "react-toastify";
import { AdminLayout } from "../components/admin/AdminLayout";
import { TabBar } from "../components/admin/TabBar";
import { NewsSection } from "../components/admin/NewsSection";
import { EventsSection } from "../components/admin/EventsSection";
import { EditNewsView } from "../components/admin/EditNewsView";
import { EditEventView } from "../components/admin/EditEventView";
import { ConfirmDeleteModal } from "../components/admin/ConfirmDeleteModal";
import { NewsArticle, Event } from "../services/interfaces";
import { deleteNewsArticle, deleteEvent } from "../services/api";

type ViewState =
  | "list"
  | "edit-news"
  | "edit-event"
  | "create-news"
  | "create-event";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<"news" | "events">("news");
  const [viewState, setViewState] = useState<ViewState>("list");

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Editing states
  const [editingNews, setEditingNews] = useState<NewsArticle | undefined>();
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();

  // Delete states
  const [deletingId, setDeletingId] = useState<string>("");
  const [deletingType, setDeletingType] = useState<"news" | "events">("news");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateClick = () => {
    if (activeTab === "news") {
      setEditingNews(undefined);
      setViewState("create-news");
    } else {
      setEditingEvent(undefined);
      setViewState("create-event");
    }
  };

  const handleNewsEdit = (article: NewsArticle) => {
    setEditingNews(article);
    setViewState("edit-news");
  };

  const handleEventEdit = (event: Event) => {
    setEditingEvent(event);
    setViewState("edit-event");
  };

  const handleBackToList = () => {
    setViewState("list");
    setEditingNews(undefined);
    setEditingEvent(undefined);
  };

  const handleDeleteClick = (id: string, type: "news" | "events") => {
    setDeletingId(id);
    setDeletingType(type);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      if (deletingType === "news") {
        await deleteNewsArticle(deletingId);
        toast.success("News article deleted successfully!");
      } else {
        await deleteEvent(deletingId);
        toast.success("Event deleted successfully!");
      }

      setDeleteModalOpen(false);
      setDeletingId("");

      // Trigger refetch by reloading (simple approach)
      // In a production app, you'd use SWR mutate for better UX
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(
        `Failed to delete ${deletingType === "news" ? "news article" : "event"}`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    // Go back to list and refresh
    setViewState("list");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const getCreateButtonText = () => {
    if (viewState !== "list") return "";
    return activeTab === "news" ? "Create News Article" : "Create Event";
  };

  const renderContent = () => {
    switch (viewState) {
      case "edit-news":
      case "create-news":
        return (
          <EditNewsView
            editingItem={editingNews}
            onBack={handleBackToList}
            onSuccess={handleFormSuccess}
          />
        );

      case "edit-event":
      case "create-event":
        return (
          <EditEventView
            editingItem={editingEvent}
            onBack={handleBackToList}
            onSuccess={handleFormSuccess}
          />
        );

      default:
        return (
          <>
            <TabBar value={activeTab} onChange={setActiveTab} />

            {activeTab === "news" ? (
              <NewsSection
                onEdit={handleNewsEdit}
                onDelete={(id) => handleDeleteClick(id, "news")}
              />
            ) : (
              <EventsSection
                onEdit={handleEventEdit}
                onDelete={(id) => handleDeleteClick(id, "events")}
              />
            )}
          </>
        );
    }
  };

  return (
    <>
      <AdminLayout
        onCreateClick={handleCreateClick}
        createButtonText={getCreateButtonText()}
      >
        {renderContent()}
      </AdminLayout>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingId("");
        }}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deletingType === "news" ? "News Article" : "Event"}`}
        message={`Are you sure you want to delete this ${
          deletingType === "news" ? "news article" : "event"
        }? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </>
  );
}
