export default function TeenTherapyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4">
              Teen Therapy
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Support for teenagers navigating the challenges of adolescence and mental health.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Adolescent Challenges</h3>
              <p className="text-gray-600">Address issues like anxiety, depression, peer pressure, and identity development.</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Teen-Friendly Approach</h3>
              <p className="text-gray-600">Therapists who specialize in working with teenagers and understand their unique needs.</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Building Confidence</h3>
              <p className="text-gray-600">Help teens develop self-esteem, coping skills, and healthy decision-making abilities.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
