import AssessmentCmsRenderer from '@/components/AssessmentCmsRenderer';

export const metadata = {
  title: "ADHD Conners 3 Assessment - Little Care",
  description: "Advanced ADHD Conners 3 assessment for comprehensive evaluation of attention and behavioral patterns in children and adolescents.",
};

export default function ADHDConners3Page() {
  return (
    <div>
      <AssessmentCmsRenderer slug="adhd-conners-3" />
    </div>
  );
}
