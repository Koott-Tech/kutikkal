import AssessmentCmsRenderer from '@/components/AssessmentCmsRenderer';

export const metadata = {
  title: "VSMS Assessment - Little Care",
  description: "Vineland Social Maturity Scale (VSMS) for assessing adaptive behavior and social skills in children and adolescents.",
};

export default function VSMSAssessmentPage() {
  return (
    <div>
      <AssessmentCmsRenderer slug="vsms" />
    </div>
  );
}
