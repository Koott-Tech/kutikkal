export default function FamilyTherapyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4">
              Family Therapy
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Heal family dynamics and build stronger relationships through collaborative therapy sessions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Family Dynamics</h3>
              <p className="text-gray-600">Understand how family patterns and interactions affect everyone&apos;s well-being.</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Collective Healing</h3>
              <p className="text-gray-600">Work together as a family unit to address challenges and create positive change.</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Support Systems</h3>
              <p className="text-gray-600">Build stronger bonds and develop healthy communication patterns within your family.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
