import AssessmentCmsRenderer from '@/components/AssessmentCmsRenderer';

export const metadata = {
  title: "CAT Assessment - Little Care",
  description: "Child Apperception Test (CAT) projective assessment for understanding children's emotional and psychological functioning.",
};

export default function CATAssessmentPage() {
  return (
    <div>
      <AssessmentCmsRenderer slug="cat" />
    </div>
  );
}
