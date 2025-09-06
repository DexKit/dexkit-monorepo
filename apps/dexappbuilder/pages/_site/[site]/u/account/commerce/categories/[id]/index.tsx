import { default as DynamicImport } from 'next/dynamic';
import AuthMainLayout from 'src/components/layouts/authMain';

// Import the component dynamically to avoid SSR issues
const EditCategoryPageComponent = DynamicImport(
  () => import('@/modules/commerce/EditCategoryPageComponent'),
  { ssr: false }
);

export default function EditCategoryPage() {
  return <EditCategoryPageComponent />;
}

(EditCategoryPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout>{page}</AuthMainLayout>;
};

// Prevent prerendering by returning no paths
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: false,
  };
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
