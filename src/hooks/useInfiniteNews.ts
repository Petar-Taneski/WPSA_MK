import useSWRInfinite from "swr/infinite";
import { fetchNewsChunk } from "@/services/api";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { NewsArticle } from "@/services/interfaces";

const PAGE_SIZE = 15;

interface NewsChunkResponse {
  items: NewsArticle[];
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}

export const useInfiniteNews = (lang: string, tag: string | null) => {
  const getKey = (pageIndex: number, previous: NewsChunkResponse | null) => {
    if (previous && !previous.items.length) return null; // reached end
    if (pageIndex === 0) return ["news", lang, tag, null];
    return ["news", lang, tag, previous?.lastDoc];
  };

  const fetcher = (
    key: [
      string,
      string,
      string | null,
      QueryDocumentSnapshot<DocumentData> | null
    ]
  ) => {
    const [, l, t, last] = key;
    return fetchNewsChunk(l, t, PAGE_SIZE, last || undefined);
  };

  const { data, error, size, setSize, mutate, isLoading } = useSWRInfinite(
    getKey,
    fetcher,
    { revalidateFirstPage: false }
  );

  const flat = data?.map((d) => d.items).flat() ?? [];
  const isEnd =
    data && data.length > 0
      ? data[data.length - 1].items.length < PAGE_SIZE
      : false;

  return { flat, error, size, setSize, isEnd, mutate, isLoading };
};
