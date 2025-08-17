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
  QueryConstraint,
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

// Functions for handling corresponding posts
export const getCorrespondingPost = async (
  correspondingId: string,
  expectedLang: string
): Promise<NewsArticle | null> => {
  try {
    const newsDoc = doc(db, "news", correspondingId);
    const newsSnapshot = await getDoc(newsDoc);

    if (!newsSnapshot.exists()) {
      return null;
    }

    const data = newsSnapshot.data();
    // Validate that the corresponding post is in the expected language
    if (data.lang !== expectedLang) {
      console.warn(
        `Corresponding post ${correspondingId} is not in expected language ${expectedLang}`
      );
      return null;
    }

    return {
      ...data,
      id: newsSnapshot.id,
      publishDate: formatDate(
        data.publishDate.toDate(),
        expectedLang === "english" ? "en" : "mk"
      ),
    } as NewsArticle;
  } catch (error) {
    console.error(
      `Error fetching corresponding post ${correspondingId}:`,
      error
    );
    return null;
  }
};

export const linkCorrespondingPosts = async (
  postId1: string,
  postId2: string,
  uid: string
): Promise<boolean> => {
  try {
    // Validate the linking before proceeding
    const validation = await validateCorrespondingPost(postId1, postId2);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Perform bidirectional linking
    await Promise.all([
      updateDoc(doc(db, "news", postId1), {
        correspondingId: postId2,
        updatedAt: serverTimestamp(),
        updatedBy: uid,
      }),
      updateDoc(doc(db, "news", postId2), {
        correspondingId: postId1,
        updatedAt: serverTimestamp(),
        updatedBy: uid,
      }),
    ]);

    return true;
  } catch (error) {
    console.error("Error linking corresponding posts:", error);
    throw error;
  }
};

export const unlinkCorrespondingPosts = async (
  postId: string,
  uid: string
): Promise<boolean> => {
  try {
    const postSnap = await getDoc(doc(db, "news", postId));

    if (!postSnap.exists()) {
      throw new Error("Post does not exist");
    }

    const postData = postSnap.data();
    const correspondingId = postData.correspondingId;

    if (!correspondingId) {
      return true; // Already unlinked
    }

    // Remove correspondingId from both posts
    const updates = [
      updateDoc(doc(db, "news", postId), {
        correspondingId: null,
        updatedAt: serverTimestamp(),
        updatedBy: uid,
      }),
    ];

    // Check if the corresponding post still exists before trying to update it
    const correspondingPostSnap = await getDoc(
      doc(db, "news", correspondingId)
    );
    if (correspondingPostSnap.exists()) {
      updates.push(
        updateDoc(doc(db, "news", correspondingId), {
          correspondingId: null,
          updatedAt: serverTimestamp(),
          updatedBy: uid,
        })
      );
    }

    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error("Error unlinking corresponding posts:", error);
    throw error;
  }
};

export const fetchPostsInOppositeLanguage = async (
  currentLang: string,
  pageSize = 50
): Promise<NewsArticle[]> => {
  try {
    const oppositeLanguage =
      currentLang === "english" ? "macedonian" : "english";
    const langForFormatting = oppositeLanguage === "english" ? "en" : "mk";

    const q = query(
      collection(db, "news"),
      where("lang", "==", oppositeLanguage),
      orderBy("publishDate", "desc"),
      limit(pageSize)
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      publishDate: formatDate(d.data().publishDate.toDate(), langForFormatting),
    })) as NewsArticle[];
  } catch (error) {
    console.error("Error fetching posts in opposite language:", error);
    throw error;
  }
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
  const data = newsArticle.data();

  try {
    // Clean up corresponding post link before deletion
    if (data?.correspondingId) {
      const correspondingPostSnap = await getDoc(
        doc(db, "news", data.correspondingId)
      );
      if (correspondingPostSnap.exists()) {
        await updateDoc(doc(db, "news", data.correspondingId), {
          correspondingId: null,
          updatedAt: serverTimestamp(),
        });
      }
    }

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

// Function to clean up orphaned references
export const cleanupOrphanedReferences = async (): Promise<void> => {
  try {
    const newsCollection = collection(db, "news");
    const newsSnapshot = await getDocs(newsCollection);

    const updates: Promise<void>[] = [];

    for (const docSnap of newsSnapshot.docs) {
      const data = docSnap.data();

      if (data.correspondingId) {
        // Check if the corresponding post still exists
        const correspondingPostSnap = await getDoc(
          doc(db, "news", data.correspondingId)
        );

        if (!correspondingPostSnap.exists()) {
          // Remove the orphaned reference
          updates.push(
            updateDoc(doc(db, "news", docSnap.id), {
              correspondingId: null,
              updatedAt: serverTimestamp(),
            })
          );
        } else {
          // Verify bidirectional linking
          const correspondingData = correspondingPostSnap.data();
          if (correspondingData.correspondingId !== docSnap.id) {
            // Fix broken bidirectional link
            updates.push(
              updateDoc(doc(db, "news", data.correspondingId), {
                correspondingId: docSnap.id,
                updatedAt: serverTimestamp(),
              })
            );
          }
        }
      }
    }

    await Promise.all(updates);
    console.log(`Cleaned up ${updates.length} orphaned references`);
  } catch (error) {
    console.error("Error cleaning up orphaned references:", error);
    throw error;
  }
};

// Enhanced validation function
export const validateCorrespondingPost = async (
  postId: string,
  correspondingId: string
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    const [postSnap, correspondingSnap] = await Promise.all([
      getDoc(doc(db, "news", postId)),
      getDoc(doc(db, "news", correspondingId)),
    ]);

    if (!postSnap.exists()) {
      return { isValid: false, error: "Original post does not exist" };
    }

    if (!correspondingSnap.exists()) {
      return { isValid: false, error: "Corresponding post does not exist" };
    }

    const postData = postSnap.data();
    const correspondingData = correspondingSnap.data();

    // Validate different languages
    if (postData.lang === correspondingData.lang) {
      return { isValid: false, error: "Posts must be in different languages" };
    }

    // Validate no circular references
    if (postId === correspondingId) {
      return { isValid: false, error: "A post cannot be linked to itself" };
    }

    // Check if either post is already linked to a different post
    if (
      postData.correspondingId &&
      postData.correspondingId !== correspondingId
    ) {
      return {
        isValid: false,
        error: "Original post is already linked to another post",
      };
    }

    if (
      correspondingData.correspondingId &&
      correspondingData.correspondingId !== postId
    ) {
      return {
        isValid: false,
        error: "Corresponding post is already linked to another post",
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Error validating corresponding post:", error);
    return { isValid: false, error: "Validation failed due to an error" };
  }
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
  try {
    let q;
    const langValue = lang === "en" ? "english" : "macedonian";

    if (tag) {
      // When filtering by tag, we need to handle the composite index requirement
      // Try the composite query first, fall back to client-side filtering if it fails
      try {
        const constraints: QueryConstraint[] = [
          where("lang", "==", langValue),
          where("tags", "array-contains", tag),
          orderBy("publishDate", "desc"),
          limit(pageSize),
        ];

        if (lastDoc) {
          constraints.push(startAfter(lastDoc));
        }

        q = query(collection(db, "news"), ...constraints);
        const snap = await getDocs(q);

        const items = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            publishDate: formatDate(data.publishDate.toDate(), lang),
            _doc: d,
          };
        }) as (NewsArticle & { _doc: DocumentSnapshot })[];

        return { items, lastDoc: snap.docs.at(-1) };
      } catch (indexError) {
        // Use fallback when composite index is not available
        const fallbackPageSize = Math.min(pageSize * 5, 100);

        try {
          // Try with orderBy first
          const constraintsWithOrder: QueryConstraint[] = [
            where("lang", "==", langValue),
            orderBy("publishDate", "desc"),
            limit(fallbackPageSize),
          ];

          if (lastDoc) {
            constraintsWithOrder.push(startAfter(lastDoc));
          }

          q = query(collection(db, "news"), ...constraintsWithOrder);
          const snap = await getDocs(q);

          const allItems = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              publishDate: formatDate(data.publishDate.toDate(), lang),
              _doc: d,
            };
          }) as (NewsArticle & { _doc: DocumentSnapshot })[];

          const filteredItems = allItems
            .filter((item) => item.tags && item.tags.includes(tag))
            .slice(0, pageSize);

          return { items: filteredItems, lastDoc: snap.docs.at(-1) };
        } catch (orderByError) {
          // Use most basic query if orderBy fails
          q = query(
            collection(db, "news"),
            where("lang", "==", langValue),
            limit(fallbackPageSize)
          );
          const snap = await getDocs(q);

          const allItems = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              publishDate: formatDate(data.publishDate.toDate(), lang),
              _doc: d,
            };
          }) as (NewsArticle & { _doc: DocumentSnapshot })[];

          const filteredItems = allItems
            .filter((item) => item.tags && item.tags.includes(tag))
            .sort((a, b) => {
              // Sort by publishDate desc client-side since we couldn't use orderBy
              const dateA = new Date(a.publishDate);
              const dateB = new Date(b.publishDate);
              return dateB.getTime() - dateA.getTime();
            })
            .slice(0, pageSize);

          return { items: filteredItems, lastDoc: snap.docs.at(-1) };
        }
      }
    } else {
      // No tag filter - simple query
      const constraints: QueryConstraint[] = [
        where("lang", "==", langValue),
        orderBy("publishDate", "desc"),
        limit(pageSize),
      ];

      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      q = query(collection(db, "news"), ...constraints);
    }

    const snap = await getDocs(q);
    const items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        publishDate: formatDate(data.publishDate.toDate(), lang),
        _doc: d,
      };
    }) as (NewsArticle & { _doc: DocumentSnapshot })[];

    return { items, lastDoc: snap.docs.at(-1) };
  } catch (error) {
    console.error("Error in fetchNewsChunk:", error);
    throw error;
  }
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
