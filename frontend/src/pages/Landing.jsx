import Navbar from "../components/Navbar"

function Landing() {
  return (
    <div className="w-full bg-white text-gray-900">

      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Boost Your Resume
                <span className="text-blue-600 block">
                  With AI Precision
                </span>
              </h1>

              <p className="mt-6 text-gray-600 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0">
                Analyze your resume, improve ATS score, match job descriptions,
                and get AI-powered suggestions to stand out.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <a
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                >
                  Get Started Free
                </a>

                <a
                  href="#features"
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-center"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg">
              <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-2xl shadow-lg flex items-center justify-center">
                <span className="text-gray-400">
                  Resume Preview Illustration
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Powerful Features To Elevate Your Resume
            </h2>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">
              Everything you need to optimize, improve, and match your resume
              with modern hiring standards.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="mt-16 grid gap-8 
                          grid-cols-1 
                          sm:grid-cols-2 
                          lg:grid-cols-3">

            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-6">📊</div>
              <h3 className="text-xl font-semibold">
                ATS Score Analysis
              </h3>
              <p className="mt-3 text-gray-600 text-sm">
                Get a detailed breakdown of how your resume performs
                in Applicant Tracking Systems.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-6">🤖</div>
              <h3 className="text-xl font-semibold">
                AI Resume Improver
              </h3>
              <p className="mt-3 text-gray-600 text-sm">
                Instantly rewrite and enhance your resume
                with professional impact-driven suggestions.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-xl font-semibold">
                Job Match Engine
              </h3>
              <p className="mt-3 text-gray-600 text-sm">
                Compare your resume against job descriptions
                and discover missing skills instantly.
              </p>
            </div>

          </div>
        </div>
      </section>

            {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold">
              How It Works
            </h2>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">
              Three simple steps to transform your resume
              into a job-winning profile.
            </p>
          </div>

          {/* Timeline */}
          <div className="mt-20 relative">

            {/* Vertical line (desktop only) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>

            <div className="grid gap-12 lg:grid-cols-3 relative">

              {/* Step 1 */}
              <div className="text-center relative">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="mt-6 text-xl font-semibold">
                  Upload Resume
                </h3>
                <p className="mt-3 text-gray-600 text-sm">
                  Upload your resume in PDF or DOC format
                  securely to our platform.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center relative">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="mt-6 text-xl font-semibold">
                  AI Analysis
                </h3>
                <p className="mt-3 text-gray-600 text-sm">
                  Our AI scans your resume, checks ATS score,
                  and analyzes job compatibility.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center relative">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="mt-6 text-xl font-semibold">
                  Get Improvements
                </h3>
                <p className="mt-3 text-gray-600 text-sm">
                  Receive detailed feedback and suggestions
                  to optimize and improve your resume.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

            {/* ================= CALL TO ACTION ================= */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">

          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready To Improve Your Resume?
          </h2>

          <p className="mt-6 text-blue-100 text-sm sm:text-base">
            Join thousands of job seekers who boosted their ATS score
            and landed interviews faster using AI-powered insights.
          </p>

          <div className="mt-10">
            <a
              href="/register"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Start Free Today
            </a>
          </div>

        </div>
      </section>

            {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid gap-12
                grid-cols-2
                lg:grid-cols-4">

            {/* Brand */}
            <div>
              <h3 className="text-white text-xl font-bold">
                Resume Analyzer
              </h3>
              <p className="mt-4 text-sm text-gray-400">
                AI-powered resume analysis platform helping job seekers
                improve their chances of getting hired.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold">
                Product
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Dashboard
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold">
                Company
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold">
                Legal
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Line */}
          <div className="mt-16 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Resume Analyzer. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  )
}

export default Landing