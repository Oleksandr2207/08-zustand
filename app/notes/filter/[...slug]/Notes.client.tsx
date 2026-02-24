"use client";

import css from "./page.module.css";

import { type FetchTagNote } from "@/types/note";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchFilterNotes } from "@/lib/api";
import { useDebouncedCallback } from "use-debounce";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Link from "next/link";

interface NotesClientProps {
  tag: FetchTagNote;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [word, setWord] = useState("");

  const { data } = useQuery({
    queryKey: ["notes", tag, page, word],
    queryFn: () => fetchFilterNotes(tag, page, word),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    throwOnError: true,
  });

  const changeWord = useDebouncedCallback((newWord: string) => {
    setPage(1); // при пошуку завжди починаємо з 1 сторінки
    setWord(newWord);
  }, 500);

  return (
    <div className={css.notes}>
      <div className={css.toolbar}>
        <SearchBox changeWord={changeWord} />

        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            setPage={setPage}
          />
        )}

        {/* Кнопка тепер просто посилання */}
        <Link href="/notes/action/create" className={css.toolBtn}>
          Create note +
        </Link>
      </div>

      {data && data.notes.length > 0 && (
        <NoteList noteList={data.notes} /> // без пропсів модалки
      )}
    </div>
  );
}
