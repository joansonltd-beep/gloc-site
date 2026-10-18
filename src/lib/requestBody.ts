export class BodyTooLarge extends Error {}

// Bound the bytes consumed, including requests without a trustworthy length header.
export async function readBoundedText(request: Request, limit: number): Promise<string> {
  const length = request.headers.get('content-length');
  if (length && /^\d+$/.test(length) && Number(length) > limit) {
    await request.body?.cancel();
    throw new BodyTooLarge('Request body is too large.');
  }
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        throw new BodyTooLarge('Request body is too large.');
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}
