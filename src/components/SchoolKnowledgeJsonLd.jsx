import { generateWebSiteSchema, generateSchoolSchema } from '../lib/seo-schemas';

export default function SchoolKnowledgeJsonLd({ config = {} }) {
  const websiteSchema = generateWebSiteSchema();
  const schoolSchema = generateSchoolSchema(config);

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema, schoolSchema]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
