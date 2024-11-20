import Image from "next/image";
'use client'
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("en.wikipedia.org/wiki/Manufacturing#List_of_countries_by_manufacturing_output");
  const [tableData, setTableData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/parse-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: `http://${url}` })
      });
      const data = await response.json();
      console.log(data);
      setTableData(data.tableData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      {!tableData.length ? (
        <div>
          <label htmlFor="company-website" className="block text-sm/6 font-medium text-gray-900">
            Insert the URL of the website with the table you want to parse.
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-xl w-xl">
              <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">http://</span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                id="company-website"
                name="company-website"
                type="text"
                placeholder="en.wikipedia.org/wiki/Manufacturing#List_of_countries_by_manufacturing_output"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
              />
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-full mr-1 my-1 hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
              >
                {isLoading ? 'Loading...' : 'Go'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}