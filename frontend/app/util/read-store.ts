import type { MemberModel } from 'frontend/types/member-model';

export function readStore(doc: Document): MemberModel[] | null {
  const metaElement = doc.querySelector(
    'meta[name="store"]',
  ) as HTMLMetaElement;

  if (!metaElement || !metaElement.content) {
    return null;
  }

  try {
    return JSON.parse(metaElement.content);
  } catch (e) {
    console.error('Unable to parse found store', e);
  }

  return null;
}
