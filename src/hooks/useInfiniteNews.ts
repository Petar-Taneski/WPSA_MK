import useSWRInfinite from "swr/infinite";
import { fetchNewsChunk } from "@/services/api";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { NewsArticle } from "@/services/interfaces";

interface NewsChunkResponse {
  items: NewsArticle[];
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}

export const useInfiniteNews = (
  lang: string,
  tag: string | null,
  pageSize: number = 15
) => {
  const getKey = (pageIndex: number, previous: NewsChunkResponse | null) => {
    if (previous && !previous.items.length) return null; // reached end
    if (pageIndex === 0) return ["news", lang, tag, pageSize, null];
    return ["news", lang, tag, pageSize, previous?.lastDoc];
  };

  const fetcher = (
    key: [
      string,
      string,
      string | null,
      number,
      QueryDocumentSnapshot<DocumentData> | null
    ]
  ) => {
    const [, l, t, ps, last] = key;
    return fetchNewsChunk(l, t, ps, last || undefined);
  };

  const { data, error, size, setSize, mutate, isLoading } = useSWRInfinite(
    getKey,
    fetcher,
    { revalidateFirstPage: false }
  );

  const flat = data?.map((d) => d.items).flat() ?? [];
  const isEnd =
    data && data.length > 0
      ? data[data.length - 1].items.length < pageSize
      : false;

  return { flat, error, size, setSize, isEnd, mutate, isLoading };
};
