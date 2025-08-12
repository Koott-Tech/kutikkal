export default function CouplesTherapyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4">
              Couples Therapy
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Strengthen your relationship and improve communication with professional couples counseling.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Communication Skills</h3>
              <p className="text-gray-600">Learn effective ways to express your feelings and listen to your partner with empathy.</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Conflict Resolution</h3>
              <p className="text-gray-600">Develop healthy strategies to resolve disagreements and build stronger bonds.</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Relationship Growth</h3>
              <p className="text-gray-600">Work together to identify goals and create a more fulfilling partnership.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
