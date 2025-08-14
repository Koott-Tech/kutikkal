export default function ChildTherapyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4">
              Child Therapy
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Specialized therapy for children using age-appropriate techniques and play-based approaches.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Play-Based Therapy</h3>
              <p className="text-gray-600">Children express themselves naturally through play, art, and creative activities.</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Emotional Support</h3>
              <p className="text-gray-600">Help your child develop healthy coping skills and emotional regulation.</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Parent Involvement</h3>
              <p className="text-gray-600">Work together with therapists to support your child&apos;s growth and development.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
