import useSWRInfinite from "swr/infinite";
import { fetchEventsChunk } from "@/services/api";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { Event } from "@/services/interfaces";

const PAGE_SIZE = 15;

interface EventsChunkResponse {
  items: Event[];
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}

export const useInfiniteEvents = (lang: string) => {
  const getKey = (pageIndex: number, previous: EventsChunkResponse | null) => {
    if (previous && !previous.items.length) return null; // reached end
    if (pageIndex === 0) return ["events", lang, null];
    return ["events", lang, previous?.lastDoc];
  };

  const fetcher = (
    key: [string, string, QueryDocumentSnapshot<DocumentData> | null]
  ) => {
    const [, l, last] = key;
    return fetchEventsChunk(l, PAGE_SIZE, last || undefined);
  };

  const { data, error, size, setSize, mutate, isLoading } = useSWRInfinite(
    getKey,
    fetcher,
    { revalidateFirstPage: false }
  );
  console.log(error);

  const flat = data?.map((d) => d.items).flat() ?? [];
  const isEnd =
    data && data.length > 0
      ? data[data.length - 1].items.length < PAGE_SIZE
      : false;

  return { flat, error, size, setSize, isEnd, mutate, isLoading };
};
