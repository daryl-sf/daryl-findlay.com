import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p className="hidden md:block">
      No note selected. Select a note, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new note.
      </Link>
    </p>
  );
}
