export interface NoteDTO {
  id: number;
  title: string;
  encryptedContent: string; // IV + ciphertext + authTag (base64)
  encryptedDek: string;     // Зашифрованный DEK (base64)
}


export interface CreateNoteRequest {
  title: string;
  encryptedContent: string; // IV + ciphertext + authTag (base64)
  encryptedDek: string;     // Зашифрованный DEK (base64)
}
