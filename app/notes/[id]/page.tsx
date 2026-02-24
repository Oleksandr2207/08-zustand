import { Metadata } from "next";
import { fetchNoteById } from "@/lib/api";

interface Props {
  params: { id: string };
}

export async function generateMetadata(
  paramsPromise: Promise<Props>,
): Promise<Metadata> {
  const { params } = await paramsPromise;

  const note = await fetchNoteById(params.id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content.slice(0, 120),
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 120),
      url: `https://your-domain.com/notes/${params.id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}
