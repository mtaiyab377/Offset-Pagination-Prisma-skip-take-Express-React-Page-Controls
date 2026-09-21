
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { getThreads } from "../services/threads.service";
import ThreadItem from "./ThreadItem.jsx";

export default function ThreadList() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["threads", { page }],
    queryFn: () => getThreads(page),
    placeholderData: keepPreviousData,
  });

  const threads = data?.threads;

  if (isPending) return <p className="muted">Loading threads…</p>;
  if (isError) return <p className="error">Could not load threads: {error.message}</p>;
  if (!threads || threads.length === 0) return <p className="muted">No threads found.</p>;

  return (
    <>
      <ul className="threads">
        {threads.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} />
        ))}
      </ul>

      <div>
        <button
          onClick={() => setPage((oldPage) => Math.max(oldPage - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span> Page {page} </span>

        <button
          onClick={() => setPage((oldPage) => oldPage + 1)}
          disabled={!data.hasMore}
        >
          Next
        </button>
      </div>
    </>
  );
}
