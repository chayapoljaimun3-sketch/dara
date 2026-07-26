import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Ensure the uploads directory exists
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  
  // Create a unique filename to prevent overwriting
  const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const path = join(uploadDir, uniqueName);
  
  await writeFile(path, buffer);
  
  return `/uploads/${uniqueName}`;
}
