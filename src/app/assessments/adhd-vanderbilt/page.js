import AssessmentCmsRenderer from '@/components/AssessmentCmsRenderer';

export const metadata = {
  title: "ADHD Vanderbilt Assessment - Little Care",
  description: "Comprehensive ADHD Vanderbilt assessment for evaluating ADHD symptoms and related behavioral concerns in children and adolescents.",
};

export default function ADHDVanderbiltPage() {
  return (
    <div>
      {/* Render via CMS-like component for uniform layout */}
      {/* slug maps to assessment key */}
      {/* Counselling pages already use a similar renderer */}
      <AssessmentCmsRenderer slug="adhd-vanderbilt" />
    </div>
  );
}
