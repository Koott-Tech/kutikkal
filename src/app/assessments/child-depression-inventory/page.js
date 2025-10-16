import AssessmentCmsRenderer from '@/components/AssessmentCmsRenderer';

export const metadata = {
  title: "Child Depression Inventory - Little Care",
  description: "Child Depression Inventory assessment for identifying depression symptoms in children and adolescents.",
};

export default function ChildDepressionInventoryPage() {
  return (
    <div>
      <AssessmentCmsRenderer slug="child-depression-inventory" />
    </div>
  );
}
