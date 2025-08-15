"use client";

export default function ProcessSteps() {
  return (
    <section className="w-full bg-white py-16 mt-8">
      <div className="mx-auto max-w-[1400px] pl-8 pr-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-medium text-black mb-4">
            How individual therapy works at Kuttikal
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto">
            From beginning to end, we'll tailor your online therapy experience to you.
          </p>
        </div>

        {/* Four Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mx-auto">
          {/* Step 1 */}
          <div className="text-center">
            <div className="bg-purple-100 rounded-2xl p-6 mb-6 h-56 min-w-[320px] flex items-center justify-center">
              <div className="space-y-2">
                <div className="bg-white rounded-full px-4 py-2 text-sm text-gray-600">Anger Management</div>
                <div className="bg-white rounded-full px-4 py-2 text-sm text-gray-600">Behavioral Issues</div>
                <div className="bg-white rounded-full px-4 py-2 text-sm text-gray-600">Chronic Impulsivity</div>
                <div className="bg-white rounded-full px-4 py-2 text-sm text-gray-600">Coping Skills</div>
              </div>
            </div>
            <h3 className="text-xl font-medium text-black mb-3 text-left">1. Tell us what's important</h3>
            <p className="text-black text-left font-light">
              We'll use your preferences and insurance details to find providers who fit your needs.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="bg-green-100 rounded-2xl p-6 mb-6 h-56 min-w-[320px] flex items-center justify-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              </div>
            </div>
            <h3 className="text-xl font-medium text-black mb-3 text-left">2. Explore your matches</h3>
            <p className="text-black text-left font-light">
              Browse the profiles of licensed, in-network providers who match your preferences.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="bg-orange-100 rounded-2xl p-6 mb-6 h-56 min-w-[320px] flex flex-col items-center justify-center space-y-4">
              <div className="text-sm font-medium text-gray-700">Mornings Before 12pm</div>
              <div className="flex space-x-2">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'S'].map((day, index) => (
                  <button
                    key={day}
                    className={`w-8 h-8 rounded-full text-sm font-medium ${
                      day === 'Fr' 
                        ? 'bg-white border-2 border-gray-400 text-gray-700' 
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <h3 className="text-xl font-medium text-black mb-3 text-left">3. Schedule your visit</h3>
            <p className="text-black text-left font-light">
              Choose your preferred time and meet with your provider as soon as tomorrow.
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div className="bg-blue-100 rounded-2xl p-6 mb-6 h-56 min-w-[320px] flex flex-col items-center justify-center relative">
              <div className="text-center mb-4">
                <div className="text-sm font-bold text-gray-800">Tyrell Washington</div>
                <div className="text-xs text-gray-600">LMFT</div>
              </div>
              <div className="w-20 h-20 bg-gray-400 rounded-full mb-4"></div>
              <div className="flex items-center justify-between w-full px-4">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                </div>
                <button className="bg-red-500 text-white text-xs px-3 py-1 rounded">
                  End
                </button>
              </div>
            </div>
            <h3 className="text-xl font-medium text-black mb-3 text-left">4. Join your online session</h3>
            <p className="text-black text-left font-light">
              Connect with your provider over live video from wherever you feel comfortable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
