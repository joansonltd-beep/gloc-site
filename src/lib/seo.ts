import type { Metadata } from 'next';
import { SITE_URL } from './siteUrl';

export const SHARE_IMAGE = {
  url: '/images/bulwark-social.png',
  width: 1200,
  height: 630,
  alt: 'Bulwark Insurance Agency Ltd, independent insurance guidance across Jamaica',
};

// Keep search and sharing metadata aligned for each canonical public page.
export function pageMetadata(metadata: Metadata): Metadata {
  const title = typeof metadata.title === 'string' ? metadata.title : '';
  const description = typeof metadata.description === 'string' ? metadata.description : '';
  const canonical = metadata.alternates?.canonical;
  const path = typeof canonical === 'string' ? canonical : '/';
  const shareTitle = `${title} | Bulwark Insurance Agency Ltd`;
  return {
    ...metadata,
    openGraph: {
      type: 'website', locale: 'en_JM', siteName: 'Bulwark Insurance Agency Ltd',
      url: new URL(path, SITE_URL).toString(),
      title: shareTitle, description, images: [SHARE_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: shareTitle, description, images: [SHARE_IMAGE.url] },
  };
}
