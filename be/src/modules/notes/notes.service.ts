import { PaginatedResponse, PaginationParams } from '../../types/common';
import { db, schema } from '../../db';
import { and, eq } from 'drizzle-orm';
import { PaginationUtils } from '../../utils/PaginationUtils';


export class NotesService {
  async getAll(
    paginationParams: PaginationParams = {},
    userId: schema.NoteInsertDTO['userId'],
  ): Promise<PaginatedResponse<schema.NoteDTO>> {

    return PaginationUtils.paginate<schema.NoteDTO>(schema.notes, {
      paginationParams,
      whereCondition: eq(schema.notes.userId, userId)
    });
  }

  async getById(id: number, userId: schema.NoteInsertDTO['userId']) {

    const [note] = await db.select().from(schema.notes)
      .where(and(
        eq(schema.notes.id, id),
        eq(schema.notes.userId, userId),
      ))
      .limit(1).execute();

    return note;
  }


  async create(
    data: Partial<Omit<schema.NoteInsertDTO, 'userId'>>,
    userId: schema.NoteInsertDTO['userId'],
  ): Promise<schema.NoteDTO> {
    const value = { ...data, userId: userId } as schema.NoteInsertDTO;

    const [note] = await db.insert(schema.notes)
      .values(value)
      .returning();

    return note;
  }

  async update(
    id: number,
    data: Partial<Omit<schema.NoteInsertDTO, 'userId'>>,
    userId: schema.NoteInsertDTO['userId'],
  ): Promise<schema.NoteDTO | undefined> {
    const [updatedNote] = await db.update(schema.notes)
      .set(data)
      .where(and(
        eq(schema.notes.id, id),
        eq(schema.notes.userId, userId),
      ))
      .returning();

    return updatedNote;
  }

  async delete(id: number, userId: schema.NoteInsertDTO['userId']): Promise<schema.NoteDTO | undefined> {
    const [deletedNote] = await db.delete(schema.notes)
      .where(and(
        eq(schema.notes.id, id),
        eq(schema.notes.userId, userId),
      ))
      .returning();

    return deletedNote;
  }
}
