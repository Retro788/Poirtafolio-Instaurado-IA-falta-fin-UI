/**
 * Converts a download speed from bytes per second to a more readable format
 *
 * @param bytesPerSecond
 * @returns
 */
export function prettyDownloadSpeed(bytesPerSecond: number): string {
  if (bytesPerSecond > 1e6) return (bytesPerSecond / 1e6).toFixed(1) + " MB/s";
  if (bytesPerSecond > 1e3) return (bytesPerSecond / 1e3).toFixed(1) + " KB/s";
  return bytesPerSecond.toFixed(0) + " B/s";
}
