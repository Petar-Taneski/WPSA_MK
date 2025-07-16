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
import { NewsArticle } from "../interfaces";
import { deleteImage } from "./images";

// Types for admin CRUD operations
export type NewsArticleInput = Omit<NewsArticle, "id" | "publishDate"> & {
  publishDate?: Date;
};

// Enhanced News CRUD Operations
export const createNewsArticle = async (
  data: NewsArticleInput,
  uid: string
): Promise<string> => {
  const dataToCreate = undefinedToNull(data);

  const ref = await addDoc(collection(db, "news"), {
    ...dataToCreate,
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
  const dataToUpdate = undefinedToNull(data);
  await updateDoc(doc(db, "news", id), {
    ...dataToUpdate,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
};

export const deleteNewsArticle = async (id: string): Promise<void> => {
  const newsArticle = await getDoc(doc(db, "news", id));

  try {
    const data = newsArticle.data();

    // Delete main image
    if (data?.imageUrl) {
      await deleteImage(data.imageUrl);
    }

    // Delete gallery images
    if (data?.gallery && Array.isArray(data.gallery)) {
      await Promise.all(
        data.gallery.map((galleryItem: { url: string; altText: string }) => {
          return deleteImage(galleryItem.url);
        })
      );
    }
  } catch (error) {
    console.error("Error deleting news article images:", error);
  }

  await deleteDoc(doc(db, "news", id));
};

// Fetch all news articles for admin (with pagination)
export const fetchAllNewsArticles = async (
  lang?: string,
  pageSize = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  items: NewsArticle[];
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}> => {
  let q = query(
    collection(db, "news"),
    orderBy("publishDate", "desc"),
    limit(pageSize)
  );

  if (lang) {
    q = query(
      collection(db, "news"),
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
  })) as NewsArticle[];

  return { items, lastDoc: snap.docs.at(-1) };
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
