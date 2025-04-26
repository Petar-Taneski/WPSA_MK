import { Event, NewsArticle } from "./interfaces";
import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  limit,
  startAfter,
  orderBy,
} from "firebase/firestore";
import { formatDate } from "@/lib/utils";

export const fetchNewsArticlesFromFirebase = async ({
  lang,
  tag,
  fetchLimit = 15,
  fetchOffset,
}: {
  lang: string;
  tag?: string | null;
  fetchLimit?: number;
  fetchOffset?: number;
}): Promise<NewsArticle[]> => {
  try {
    const newsCollection = collection(db, "news");

    let newsQuery = query(
      newsCollection,
      where("lang", "==", lang === "en" ? "english" : "macedonian")
    );

    if (tag && tag.trim() !== "") {
      newsQuery = query(newsQuery, where("tags", "array-contains", tag));
    }

    if (fetchLimit) {
      newsQuery = query(newsQuery, limit(fetchLimit));
    }

    if (fetchOffset) {
      newsQuery = query(newsQuery, startAfter(fetchOffset));
    }

    const newsSnapshot = await getDocs(
      query(newsQuery, orderBy("publishDate", "desc"))
    );
    const newsList = newsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      publishDate: formatDate(doc.data().publishDate.toDate()),
    })) as NewsArticle[];
    return newsList;
  } catch (error) {
    console.error("Error fetching news articles from Firebase:", error);
    throw error;
  }
};

export const fetchNewsArticleFromFirebase = async (
  id: string
): Promise<NewsArticle | null> => {
  try {
    const newsDoc = doc(db, "news", id);
    const newsSnapshot = await getDoc(newsDoc);

    if (!newsSnapshot.exists()) {
      return null;
    }

    return {
      ...newsSnapshot.data(),
      id: newsSnapshot.id,
      publishDate: formatDate(newsSnapshot.data().publishDate.toDate()),
    } as NewsArticle;
  } catch (error) {
    console.error(
      `Error fetching news article with ID: ${id} from Firebase:`,
      error
    );
    throw error;
  }
};

export const fetchEventsFromFirebase = async ({
  lang,
  fetchLimit = 15,
  fetchOffset,
  isFeatured,
  filter,
}: {
  lang: string;
  fetchLimit?: number;
  fetchOffset?: number;
  isFeatured?: boolean;
  filter?: "all" | "upcoming" | "past";
}): Promise<Event[]> => {
  try {
    const eventsCollection = collection(db, "events");

    let eventsQuery = query(
      eventsCollection,
      where("lang", "==", lang === "en" ? "english" : "macedonian")
    );

    if (fetchLimit) {
      eventsQuery = query(eventsQuery, limit(fetchLimit));
    }

    if (fetchOffset) {
      eventsQuery = query(eventsQuery, startAfter(fetchOffset));
    }

    if (isFeatured) {
      eventsQuery = query(eventsQuery, where("isFeatured", "==", isFeatured));
    }

    if (filter) {
      if (filter === "upcoming") {
        eventsQuery = query(eventsQuery, where("eventDate", ">=", new Date()));
      } else if (filter === "past") {
        eventsQuery = query(eventsQuery, where("eventDate", "<", new Date()));
      }
    }

    const eventsSnapshot = await getDocs(
      query(eventsQuery, orderBy("eventDate", "desc"))
    );

    const eventsList = eventsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      eventDate: formatDate(doc.data().eventDate.toDate()),
      publishDate: formatDate(doc.data().publishDate.toDate()),
    })) as Event[];

    return eventsList;
  } catch (error) {
    console.error("Error fetching events from Firebase:", error);
    throw error;
  }
};

export const fetchEventFromFirebase = async (
  id: string
): Promise<Event | null> => {
  try {
    const eventDoc = doc(db, "events", id);
    const eventSnapshot = await getDoc(eventDoc);

    if (!eventSnapshot.exists()) {
      return null;
    }

    return {
      ...eventSnapshot.data(),
      id: eventSnapshot.id,
      eventDate: formatDate(eventSnapshot.data().eventDate.toDate()),
      publishDate: formatDate(eventSnapshot.data().publishDate.toDate()),
    } as Event;
  } catch (error) {
    console.error(`Error fetching event with ID: ${id} from Firebase:`, error);
    throw error;
  }
};
