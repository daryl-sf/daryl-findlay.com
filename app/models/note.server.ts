import arc from "@architect/functions";
import { createId } from "@paralleldrive/cuid2";

import type { User } from "./user.server";

export interface Note {
  id: ReturnType<typeof createId>;
  userId: User["id"];
  title: string;
  body: string;
}

interface NoteItem {
  pk: User["id"];
  sk: `note#${Note["id"]}`;
}

const skToId = (sk: NoteItem["sk"]): Note["id"] => sk.replace(/^note#/, "");
const idToSk = (id: Note["id"]): NoteItem["sk"] => `note#${id}`;

export async function getNote({
  id,
  userId,
}: Pick<Note, "id" | "userId">): Promise<Note | null> {
  const db = await arc.tables();

  const result = await db.note.get({ pk: userId, sk: idToSk(id) });

  if (result) {
    return {
      userId: result.pk,
      id: result.sk,
      title: result.title,
      body: result.body,
    };
  }
  return null;
}

export async function getNoteListItems({
  userId,
}: Pick<Note, "userId">): Promise<Pick<Note, "id" | "title">[]> {
  const db = await arc.tables();

  const result = await db.note.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: { ":pk": userId },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.Items.map((n: any) => ({
    title: n.title,
    id: skToId(n.sk),
  }));
}

export async function createNote({
  body,
  title,
  userId,
}: Pick<Note, "body" | "title" | "userId">): Promise<Note> {
  const db = await arc.tables();

  const result = await db.note.put({
    pk: userId,
    sk: idToSk(createId()),
    title: title,
    body: body,
  });
  return {
    id: skToId(result.sk),
    userId: result.pk,
    title: result.title,
    body: result.body,
  };
}

export async function deleteNote({ id, userId }: Pick<Note, "id" | "userId">) {
  const db = await arc.tables();
  return db.note.delete({ pk: userId, sk: idToSk(id) });
}

export async function updateNote({
  id,
  userId,
  title,
  body,
}: Pick<Note, "id" | "userId"> & Partial<Pick<Note, "title" | "body">>) {
  const db = await arc.tables();

  let updateExp = "set";
  const expAttributeValues: Record<string, string> = {};
  if (title !== undefined) {
    updateExp += " title = :t,";
    expAttributeValues[":t"] = title;
  }
  if (body !== undefined) {
    updateExp += " body = :b,";
    expAttributeValues[":b"] = body;
  }
  updateExp = updateExp.replace(/,$/, "");

  const updateParams = {
    TableName: "note",
    Key: { pk: userId, sk: idToSk(id) },
    UpdateExpression: updateExp,
    ExpressionAttributeValues: expAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  const result = await db.note.update(updateParams);

  return {
    id: skToId(result.Attributes!.sk),
    userId: result.Attributes!.pk,
    title: result.Attributes?.title,
    body: result.Attributes?.body,
  };
}
