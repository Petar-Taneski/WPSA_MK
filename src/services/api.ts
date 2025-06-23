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
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  DocumentSnapshot,
} from "firebase/firestore";
import { formatDate } from "@/lib/utils";

// Types for admin CRUD operations
export type NewsArticleInput = Omit<NewsArticle, "id" | "publishDate"> & {
  publishDate?: Date;
};

export type EventInput = Omit<
  Event,
  "id" | "publishDate" | "eventDate" | "eventEndDate"
> & {
  publishDate?: Date;
  eventDate: Date;
  eventEndDate?: Date;
};

// News CRUD Operations
export const createNewsArticle = async (
  data: NewsArticleInput,
  uid: string
): Promise<string> => {
  const ref = await addDoc(collection(db, "news"), {
    ...data,
    publishDate: data.publishDate ?? serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  });
  return ref.id;
};

export const updateNewsArticle = async (
  id: string,
  data: Partial<NewsArticleInput>,
  uid: string
): Promise<void> => {
  await updateDoc(doc(db, "news", id), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
};

export const deleteNewsArticle = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "news", id));
};

// Event CRUD Operations
export const createEvent = async (
  data: EventInput,
  uid: string
): Promise<string> => {
  const ref = await addDoc(collection(db, "events"), {
    ...data,
    publishDate: data.publishDate ?? serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  });
  return ref.id;
};

export const updateEvent = async (
  id: string,
  data: Partial<EventInput>,
  uid: string
): Promise<void> => {
  await updateDoc(doc(db, "events", id), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
};

export const deleteEvent = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "events", id));
};

// Infinite scroll functions
export const fetchNewsChunk = async (
  lang: string,
  tag: string | null,
  pageSize = 15,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
) => {
  let q = query(
    collection(db, "news"),
    where("lang", "==", lang === "en" ? "english" : "macedonian"),
    orderBy("publishDate", "desc"),
    limit(pageSize)
  );

  if (tag) {
    q = query(q, where("tags", "array-contains", tag));
  }

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    publishDate: formatDate(d.data().publishDate.toDate(), lang),
    _doc: d,
  })) as (NewsArticle & { _doc: DocumentSnapshot })[];

  return { items, lastDoc: snap.docs.at(-1) };
};

export const fetchEventsChunk = async (
  lang: string,
  pageSize = 15,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
) => {
  let q = query(
    collection(db, "events"),
    where("lang", "==", lang === "en" ? "english" : "macedonian"),
    orderBy("publishDate", "desc"),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    publishDate: formatDate(d.data().publishDate.toDate(), lang),
    eventDate: formatDate(d.data().eventDate.toDate(), lang),
    _doc: d,
  })) as (Event & { _doc: DocumentSnapshot })[];

  return { items, lastDoc: snap.docs.at(-1) };
};

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
      publishDate: formatDate(doc.data().publishDate.toDate(), lang),
    })) as NewsArticle[];
    return newsList;
  } catch (error) {
    console.error("Error fetching news articles from Firebase:", error);
    throw error;
  }
};

export const fetchNewsArticleFromFirebase = async (
  id: string,
  lang: string
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
      publishDate: formatDate(newsSnapshot.data().publishDate.toDate(), lang),
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
      eventDate: formatDate(doc.data().eventDate.toDate(), lang),
      publishDate: formatDate(doc.data().publishDate.toDate(), lang),
    })) as Event[];

    return eventsList;
  } catch (error) {
    console.error("Error fetching events from Firebase:", error);
    throw error;
  }
};

export const fetchEventFromFirebase = async (
  id: string,
  lang: string
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
      eventDate: formatDate(eventSnapshot.data().eventDate.toDate(), lang),
      publishDate: formatDate(eventSnapshot.data().publishDate.toDate(), lang),
    } as Event;
  } catch (error) {
    console.error(`Error fetching event with ID: ${id} from Firebase:`, error);
    throw error;
  }
};

export const sendJoinUsEmail = async (formData: {
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  zvanje: string;
  pol: string;
  datumNaRagjanje: string;
  kompanija: string;
  adresa: string;
  postenskiBroj: string;
  grad: string;
}) => {
  try {
    const {
      ime,
      prezime,
      email,
      telefon,
      zvanje,
      pol,
      datumNaRagjanje,
      kompanija,
      adresa,
      postenskiBroj,
      grad,
    } = formData;
    const emailData = {
      ime,
      prezime,
      email,
      telefon,
      zvanje,
      pol,
      datumNaRagjanje,
      kompanija,
      adresa,
      postenskiBroj,
      grad,
    };
    const emailText = Object.entries(emailData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    await addDoc(collection(db, "mail"), {
      to: ["1nikolablagoevski6@gmail.com"],
      message: {
        subject: "Пријавување на нов член",
        text: emailText,
      },
    });
  } catch (error) {
    console.error("Error sending join us email:", error);
    throw error;
  }
};
