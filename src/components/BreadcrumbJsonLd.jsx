import { headers } from 'next/headers';
import { generateBreadcrumbSchema } from '../lib/breadcrumbs';

export default async function BreadcrumbJsonLd({ pathname: manualPathname, customLastItem }) {
  let targetPath = manualPathname;
  if (!targetPath) {
    try {
      const headersList = await headers();
      targetPath = headersList.get('x-pathname') || '';
    } catch {
      targetPath = '';
    }
  }

  // Jangan render untuk root path ("/" atau "") karena Google merekomendasikan breadcrumb untuk sub-halaman
  const cleanPath = (targetPath || '').split('?')[0].split('#')[0];
  const segments = cleanPath.split('/').filter(Boolean);
  if (segments.length === 0) {
    return null;
  }

  // Abaikan area privat/admin/dashboard
  if (
    cleanPath.startsWith('/admin') ||
    cleanPath.startsWith('/guru') ||
    cleanPath.startsWith('/login') ||
    cleanPath.startsWith('/api') ||
    cleanPath.startsWith('/formulir-ppdb') ||
    cleanPath.startsWith('/ppdb/cetak')
  ) {
    return null;
  }

  const schema = generateBreadcrumbSchema(targetPath, customLastItem);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
