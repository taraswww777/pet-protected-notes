export interface NoteDTO {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface CreateNoteBody {
  title: string;
  content: string;
}
