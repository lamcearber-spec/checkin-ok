/**
 * Convert PDF pages to PNG images using poppler pdftoppm.
 * Same approach as konverter-pro's Python pdf2image pipeline.
 */

import { execFile } from 'child_process';
import { readdir, readFile, writeFile, rm, mkdir } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';

export interface PageImage {
  pageNumber: number;
  buffer: Buffer;
  mimeType: 'image/png';
}

/**
 * Convert a PDF buffer into PNG page images using pdftoppm.
 *
 * @param pdfBuffer - Raw PDF file content
 * @param maxPages - Maximum pages to convert (default 10)
 * @param dpi - Resolution (default 200 for balance of quality/size)
 * @returns Array of page images as PNG buffers
 */
export async function pdfToImages(
  pdfBuffer: Buffer,
  maxPages: number = 10,
  dpi: number = 200,
): Promise<PageImage[]> {
  const tempDir = join(tmpdir(), `pdf-vision-${randomUUID()}`);
  const pdfPath = join(tempDir, 'input.pdf');
  const outputPrefix = join(tempDir, 'page');

  try {
    await mkdir(tempDir, { recursive: true });

    // Write PDF to temp file
    await writeFile(pdfPath, pdfBuffer);

    // Run pdftoppm to convert PDF pages to PNG
    await new Promise<void>((resolve, reject) => {
      execFile(
        'pdftoppm',
        [
          '-png',
          '-r', String(dpi),
          '-l', String(maxPages), // last page
          pdfPath,
          outputPrefix,
        ],
        { timeout: 30_000 },
        (error, _stdout, stderr) => {
          if (error) {
            reject(new Error(`pdftoppm failed: ${error.message}${stderr ? ` — ${stderr}` : ''}`));
          } else {
            resolve();
          }
        },
      );
    });

    // Read generated PNG files (pdftoppm names them page-01.png, page-02.png, etc.)
    const files = await readdir(tempDir);
    const pngFiles = files
      .filter((f) => f.startsWith('page-') && f.endsWith('.png'))
      .sort();

    const images: PageImage[] = [];
    for (let i = 0; i < pngFiles.length; i++) {
      const buf = await readFile(join(tempDir, pngFiles[i]));
      images.push({
        pageNumber: i + 1,
        buffer: buf,
        mimeType: 'image/png',
      });
    }

    return images;
  } finally {
    // Cleanup temp directory
    try {
      await rm(tempDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  }
}

/**
 * Check if pdftoppm is available on the system.
 */
export async function isPdftoppmAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    execFile('pdftoppm', ['-v'], (error) => {
      resolve(!error);
    });
  });
}
