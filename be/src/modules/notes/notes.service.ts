import { PaginatedResponse, PaginationParams } from '../../types';
import { db, schema } from '../../db';
import { eq, sql } from 'drizzle-orm';


export class NotesService {
  async getAll(
    {
      page = 1,
      limit = 10
    }: PaginationParams = {}
  ): Promise<PaginatedResponse<schema.NoteDTO>> {
    const offset = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      db.select()
        .from(schema.notes)
        .limit(limit)
        .offset(offset)
        .execute(),

      db.select({
        count: sql<number>`count(id)`
      })
        .from(schema.notes)
        .then((res) => res[0]?.count || 0)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: notes.map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
      })),
      countItems: notes.length,
      total: +total,
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  getById(id: number) {
    return db.select().from(schema.notes).where(eq(schema.notes.id, id)).limit(1).execute();
  }


  async create(data: schema.NoteInsertDTO): Promise<schema.NoteDTO> {
    const [note] = await db.insert(schema.notes)
      .values(data)
      .returning();

    return note;
  }

  async update(id: number, data: Partial<schema.NoteInsertDTO>): Promise<schema.NoteDTO | undefined> {
    const [updatedNote] = await db.update(schema.notes)
      .set(data)
      .where(eq(schema.notes.id, id))
      .returning();

    return updatedNote;
  }

  async delete(id: number): Promise<schema.NoteDTO | undefined> {
    const [deletedNote] = await db.delete(schema.notes)
      .where(eq(schema.notes.id, id))
      .returning();

    return deletedNote;
  }
}
