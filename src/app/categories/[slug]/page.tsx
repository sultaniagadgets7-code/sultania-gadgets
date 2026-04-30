import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoriesSlugRedirect({ params }: Props) {
  const { slug } = await params;
  // Redirect /categories/[slug] to /category/[slug]
  redirect(`/category/${slug}`);
}
