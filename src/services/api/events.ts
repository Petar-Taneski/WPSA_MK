import { formatDate, undefinedToNull } from "@/lib/utils";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { Event } from "../interfaces";
import { deleteImage } from "./images";

export type EventInput = Omit<
  Event,
  "id" | "publishDate" | "eventDate" | "eventEndDate"
> & {
  publishDate?: Date;
  eventDate: Date;
  eventEndDate?: Date;
};

// Enhanced Event CRUD Operations
export const createEvent = async (
  data: EventInput,
  uid: string
): Promise<string> => {
  const dataToCreate = undefinedToNull(data);
  const ref = await addDoc(collection(db, "events"), {
    ...dataToCreate,
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
  const dataToUpdate = undefinedToNull(data);
  await updateDoc(doc(db, "events", id), {
    ...dataToUpdate,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
};

export const deleteEvent = async (id: string): Promise<void> => {
  const event = await getDoc(doc(db, "events", id));
  try {
    await deleteImage(event.data()?.imageUrl);
    await Promise.all(
      event.data()?.galleryImages.map((imageUrl: string) => {
        deleteImage(imageUrl);
      })
    );
  } catch (error) {
    console.error("Error deleting event images:", error);
  }

  await deleteDoc(doc(db, "events", id));
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

// Fetch all events for admin (with pagination)
export const fetchAllEvents = async (
  lang?: string,
  pageSize = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  items: Event[];
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}> => {
  let q = query(
    collection(db, "events"),
    orderBy("publishDate", "desc"),
    limit(pageSize)
  );

  if (lang) {
    q = query(
      collection(db, "events"),
      where("lang", "==", lang === "en" ? "english" : "macedonian"),
      orderBy("publishDate", "desc"),
      limit(pageSize)
    );
  }

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    publishDate: formatDate(d.data().publishDate.toDate(), lang || "en"),
    eventDate: formatDate(d.data().eventDate.toDate(), lang || "en"),
    eventEndDate: d.data().eventEndDate
      ? formatDate(d.data().eventEndDate.toDate(), lang || "en")
      : undefined,
  })) as Event[];

  return { items, lastDoc: snap.docs.at(-1) };
};
