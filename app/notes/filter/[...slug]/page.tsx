import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { FetchTagNote } from "@/types/note";
import { fetchFilterNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

import css from "./page.module.css";

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

type Props = {
  params: { slug: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const filter = params.slug?.join(", ") || "All";

  return {
    title: `Filtered by ${filter} | NoteHub`,
    description: `Viewing notes filtered by ${filter} in NoteHub.`,
    openGraph: {
      title: `Filtered by ${filter} | NoteHub`,
      description: `Viewing notes filtered by ${filter}.`,
      url: `https://your-domain.com/notes/filter/${params.slug?.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const queryClient = new QueryClient();

  const { slug } = await params;
  const tag = slug[0] as FetchTagNote;

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, 1, ""],
    queryFn: () => fetchFilterNotes(tag, 1, ""),
  });

  return (
    <main className={css.main}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    </main>
  );
}
