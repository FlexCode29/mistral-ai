import Image from "next/image";




export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div>
      <label htmlFor="company-website" className="block text-sm/6 font-medium text-gray-900">
      Company Website
      </label>
      <div className="mt-2">
      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">http://</span>
      <input
      id="company-website"
      name="company-website"
      type="text"
      placeholder="www.example.com"
      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
      />
      <button className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-full mr-1 my-1 hover:bg-indigo-700 transition-colors">
      Go
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
      </button>
      </div>
      </div>
      </div>
    </div>
  );
}
