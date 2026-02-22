    import { Link } from "react-router-dom"

    function Navbar() {
    return (
        <header className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-900">
                Resume<span className="text-blue-600">Analyzer</span>
            </Link>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-4">
                <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition"
                >
                Login
                </Link>
                <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                Get Started
                </Link>
            </div>

            </div>
        </div>
        </header>
    )
    }

    export default Navbar