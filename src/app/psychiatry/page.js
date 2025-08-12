export default function PsychiatryPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4">
              Psychiatry
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Medical treatment for mental health conditions with licensed psychiatrists and medication management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Medical Assessment</h3>
              <p className="text-gray-600">Comprehensive evaluation of mental health symptoms and medical history.</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Medication Management</h3>
              <p className="text-gray-600">Careful monitoring and adjustment of psychiatric medications when needed.</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Integrated Care</h3>
              <p className="text-gray-600">Combination of medication and therapy for comprehensive mental health treatment.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
