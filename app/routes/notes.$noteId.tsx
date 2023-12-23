import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import invariant from "tiny-invariant";

import { deleteNote, getNote, updateNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ id: params.noteId, userId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ note });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  if (intent.includes("edit")) {
    const fieldName = intent.replace("-edit", "");
    const value = String(formData.get(fieldName)) || undefined;

    await updateNote({ id: params.noteId, userId, [fieldName]: value });
    return redirect(`/notes/${params.noteId}`);
  } else {
    await deleteNote({ id: params.noteId, userId });
    return redirect("/notes");
  }
};

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <EditableText
        value={data.note.title}
        fieldName="title"
        buttonLabel="titleButton"
        buttonClassName="text-2xl font-bold block"
        inputClassName="text-2xl flex-1 rounded-md border-2 border-blue-500 px-1 w-full"
        inputLabel="titleInput"
      />
      <EditableText
        value={data.note.body}
        fieldName="body"
        buttonLabel="bodyButton"
        buttonClassName="text-xl my-6 block"
        inputClassName="my-6 w-full flex-1 rounded-md border-2 border-blue-500 px-1 py-2 text-lg leading-6"
        inputLabel="bodyInput"
        inputType="textarea"
      />
      <hr className="my-4" />
      <Form method="delete">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}

function EditableText({
  children,
  fieldName,
  value,
  inputClassName,
  inputLabel,
  inputType = "text",
  buttonClassName,
  buttonLabel,
}: {
  children?: React.ReactNode;
  fieldName: string;
  value: string;
  inputClassName?: string;
  inputLabel?: string;
  inputType?: "text" | "textarea";
  buttonClassName?: string;
  buttonLabel?: string;
}) {
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  if (fetcher.formData?.has(fieldName)) {
    value = String(fetcher.formData.get(fieldName));
  }

  return isEditing ? (
    <fetcher.Form
      method="post"
      onSubmit={(event) => {
        event.preventDefault();
        flushSync(() => {
          setIsEditing(false);
          fetcher.submit(event.currentTarget);
        });
        buttonRef.current?.focus();
      }}
    >
      <input type="hidden" name="intent" value={`${fieldName}-edit`} />
      {children}
      {inputType === "text" ? (
        <input
          ref={inputRef}
          type="text"
          aria-label={inputLabel}
          name={fieldName}
          defaultValue={value}
          className={inputClassName}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              flushSync(() => {
                setIsEditing(false);
              });
              buttonRef.current?.focus();
            }
          }}
          onBlur={(event) => {
            if (inputRef.current?.value !== value) {
              fetcher.submit(event.currentTarget.form);
            }
            setIsEditing(false);
          }}
        />
      ) : (
        <textarea
          ref={textAreaRef}
          aria-label={inputLabel}
          name={fieldName}
          defaultValue={value}
          rows={8}
          className={inputClassName}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              flushSync(() => {
                setIsEditing(false);
              });
              buttonRef.current?.focus();
            }
          }}
          onBlur={(event) => {
            if (inputRef.current?.value !== value) {
              fetcher.submit(event.currentTarget.form);
            }
            setIsEditing(false);
          }}
        />
      )}
    </fetcher.Form>
  ) : (
    <button
      aria-label={buttonLabel}
      type="button"
      ref={buttonRef}
      onClick={() => {
        flushSync(() => {
          setIsEditing(true);
        });
        inputType === "text"
          ? inputRef.current?.focus()
          : textAreaRef.current?.focus();
      }}
      className={buttonClassName}
    >
      {value || <span className="text-gray-400 italic">Edit</span>}
    </button>
  );
}
