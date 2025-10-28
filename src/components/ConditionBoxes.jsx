"use client";

export default function ConditionBoxes({ cmsData = null }) {
  // Default conditions if no CMS data provided
  const defaultConditions = [
    {
      title: 'ADHD',
      description: 'Support for attention and focus challenges',
      link: '/assessments/adhd-vanderbilt'
    },
    {
      title: 'Anxiety',
      description: 'Help managing worry and stress',
      link: '/counselling/anxiety-sadness'
    },
    {
      title: 'Depression',
      description: 'Support for mood and emotional wellbeing',
      link: '/counselling/anxiety-sadness'
    }
  ];

  const conditions = cmsData?.condition_boxes || defaultConditions;

  return (
    <div className="w-full py-12 md:py-16 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {conditions.map((condition, index) => (
            <a
              key={index}
              href={condition.link || '#'}
              className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer block"
            >
              <h7 className="font-semibold text-gray-900 mb-2">
                {condition.title}
              </h7>
              <p className="text-gray-600 text-sm">
                {condition.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

