export function resolveImageSrc(image: string | { src: string } | undefined | null): string {
  if (!image) return "";
  return typeof image === "string" ? image : image.src;
}
