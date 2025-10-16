import AssessmentCmsRenderer from '@/components/AssessmentCmsRenderer';

export const metadata = {
  title: "BASC-3 Assessment - Little Care",
  description: "Comprehensive Behaviour Assessment System (BASC-3) for evaluating behavioral and emotional functioning in children and adolescents.",
};

export default function BASC3Page() {
  return (
    <div>
      <AssessmentCmsRenderer slug="basc-3" />
    </div>
  );
}
