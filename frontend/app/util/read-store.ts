export function readStore(doc: Document): Array | null {
  const metaElement = doc.querySelector(
    'meta[name="store"]',
  ) as HTMLMetaElement;

  if (!metaElement) {
    return null;
  }

  try {
    return JSON.parse(metaElement.content);
  } catch (e) {
    console.error('Unable to parse found store', e);
  }

  return null;
}
