import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getThreads } from "../services/threads.service";
import ThreadItem from "./ThreadItem.jsx";

export default function ThreadList() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["threads", { page }],
    queryFn: () => getThreads(page),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <p className="muted">Loading threads…</p>;
  if (isError) return <p className="error">Could not load threads: {error.message}</p>;
  if (!data?.threads || data.threads.length === 0) return <p className="muted">No threads found.</p>;

  return (
    <>
      <ul className="threads">
        {data.threads.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} />
        ))}
      </ul>

      <nav className="pager" aria-label="Pagination">
        <button
          type="button"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span className="page-label">Page {page}</span>

        <button
          type="button"
          onClick={() => setPage((old) => old + 1)}
          disabled={!data.hasMore}
        >
          Next
        </button>
      </nav>
    </>
  );
}
