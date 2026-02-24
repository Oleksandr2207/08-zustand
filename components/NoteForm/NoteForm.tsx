"use client";

import css from "./NoteForm.module.css";
import { useId } from "react";
import { useRouter } from "next/navigation";
import { useNoteStore } from "@/lib/store/noteStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { type NewNote, type TagNote } from "@/types/note";

export default function NoteForm() {
  const id = useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const createMutation = useMutation({
    mutationFn: async (data: NewNote) => {
      return await createNote(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  function handleSubmit(formData: FormData) {
    const newNote: NewNote = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as TagNote,
    };

    createMutation.mutate(newNote);
  }

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor={`${id}-title`}>Title</label>
        <input
          type="text"
          id={`${id}-title`}
          name="title"
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
          className={css.input}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${id}-content`}>Content</label>
        <textarea
          id={`${id}-content`}
          name="content"
          rows={8}
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${id}-tag`}>Tag</label>
        <select
          id={`${id}-tag`}
          name="tag"
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value })}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          onClick={() => router.back()} // draft НЕ очищається
          className={css.cancelButton}
        >
          Cancel
        </button>

        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
}
