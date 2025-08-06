import { PaginatedResponse, PaginationParams } from '../../types/common';
import { db, schema } from '../../db';
import { eq, sql } from 'drizzle-orm';


export class NotesService {
  async getAll(
    {
      page = 1,
      limit = 10,
    }: PaginationParams = {},
    user_id: schema.NoteInsertDTO['user_id'],
  ): Promise<PaginatedResponse<schema.NoteDTO>> {
    const offset = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      db.select()
        .from(schema.notes)
        .where(eq(schema.notes.user_id, user_id))
        .limit(limit)
        .offset(offset)
        .execute(),

      db.select({
        count: sql<number>`count(id)`,
      })
        .from(schema.notes)
        .where(eq(schema.notes.user_id, user_id))
        .then((res) => res[0]?.count || 0),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: notes,
      countItems: notes.length,
      total: +total,
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  async getById(id: number, user_id: schema.NoteInsertDTO['user_id']) {
    const [note] = await db.select().from(schema.notes)
      .where(eq(schema.notes.id, id) && eq(schema.notes.user_id, user_id))
      .limit(1)
      .execute();

    return note;
  }


  async create(
    data: Partial<Omit<schema.NoteInsertDTO, 'user_id'>>,
    userId: schema.NoteInsertDTO['user_id'],
  ): Promise<schema.NoteDTO> {
    const value = { ...data, user_id: userId } as schema.NoteInsertDTO;

    const [note] = await db.insert(schema.notes)
      .values(value)
      .returning();

    return note;
  }

  async update(
    id: number,
    data: Partial<Omit<schema.NoteInsertDTO, 'user_id'>>,
    user_id: schema.NoteInsertDTO['user_id'],
  ): Promise<schema.NoteDTO | undefined> {
    const [updatedNote] = await db.update(schema.notes)
      .set(data)
      .where(eq(schema.notes.id, id) && eq(schema.notes.user_id, user_id))
      .returning();

    return updatedNote;
  }

  async delete(id: number, user_id: schema.NoteInsertDTO['user_id']): Promise<schema.NoteDTO | undefined> {
    const [deletedNote] = await db.delete(schema.notes)
      .where(eq(schema.notes.id, id) && eq(schema.notes.user_id, user_id))
      .returning();

    return deletedNote;
  }
}
