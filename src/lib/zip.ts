import type { GeneratedFile } from '@/generators';
import { downloadBlob } from './download';

/** jszip loads on demand: most visits never make a zip. */
export async function downloadZip(filename: string, files: GeneratedFile[]): Promise<void> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  for (const file of files) zip.file(file.path, file.content);
  downloadBlob(filename, await zip.generateAsync({ type: 'blob' }));
}
