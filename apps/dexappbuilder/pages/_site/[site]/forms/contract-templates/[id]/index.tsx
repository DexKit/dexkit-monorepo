import { default as DynamicImport } from 'next/dynamic';
import AuthMainLayout from 'src/components/layouts/authMain';

// Import the component dynamically to avoid SSR issues
const ViewContractTemplatePageComponent = DynamicImport(
  () => import('@/modules/forms/ViewContractTemplatePageComponent'),
  { ssr: false }
);

export default function ViewContractTemplatePage() {
  return <ViewContractTemplatePageComponent />;
}

(ViewContractTemplatePage as any).getLayout = function getLayout(page: any) {
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
