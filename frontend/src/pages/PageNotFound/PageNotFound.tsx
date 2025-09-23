import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function PageNotFound() {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Animated 404 Illustration */}
          <div className="relative m-6">
            <div className="absolute -inset-4 bg-green-100 rounded-full opacity-70 animate-pulse"></div>
            <div className="relative bg-white p-12 m-4 rounded-full shadow-lg border-8 border-green-200">
              <svg
                className="w-32 h-32 mx-auto text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-800">
              Page Not Found
            </h2>
            <p className="text-gray-600">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Ayurveda-themed message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-green-700 font-medium">
                "Like an imbalance in doshas, this path is out of harmony. Let's
                return to balance."
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 shadow-md !text-white"
            >
              <Link to="/" className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-white" // Added text-white here
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                Return Home
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link to="/contact-us" className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
