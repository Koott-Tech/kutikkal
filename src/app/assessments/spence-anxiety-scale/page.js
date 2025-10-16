import AssessmentCmsRenderer from '@/components/AssessmentCmsRenderer';

export const metadata = {
  title: "Spence Anxiety Scale - Little Care",
  description: "Comprehensive Spence Anxiety Scale assessment for anxiety disorders and related symptoms in children and adolescents.",
};

export default function SpenceAnxietyScalePage() {
  return (
    <div>
      <AssessmentCmsRenderer slug="spence-anxiety-scale" />
    </div>
  );
}
