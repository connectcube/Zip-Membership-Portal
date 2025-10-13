import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="px-6 text-center">
        <div className="mb-8">
          <h1 className="mb-4 font-bold text-blue-600 text-9xl">404</h1>
          <h2 className="mb-4 font-semibold text-gray-800 text-3xl">Page Not Found</h2>
          <p className="mx-auto mb-8 max-w-md text-gray-600 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex sm:flex-row flex-col justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center bg-gradient-to-r from-blue-500 hover:from-blue-700 to-blue-600 hover:to-blue-800 px-6 py-3 rounded-lg text-white transition-colors duration-300"
          >
            <Home className="mr-2 w-5 h-5" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center hover:bg-gray-50 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 transition-colors"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
