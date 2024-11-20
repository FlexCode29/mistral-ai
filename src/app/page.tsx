'use client'
import { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const [url, setUrl] = useState("scholar.google.co.uk/citations?view_op=top_venues&hl=en&vq=eng_artificialintelligence");
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
    <div className="flex min-h-screen items-center justify-center px-4">
      {!tableData.length ? (
        <div className="w-full max-w-2xl mx-auto">
          <label htmlFor="company-website" className="block text-sm/6 font-medium text-gray-900">
            Insert the URL of the website with the table you want to parse. The 130k ctx limits this tool to short websites.
          </label>
          <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
            <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">http://</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              id="company-website"
              name="company-website"
              type="text"
              placeholder="scholar.google.co.uk/citations?view_op=top_venues&hl=en&vq=eng_artificialintelligence"
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
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold text-gray-900">Parsed Table Data</h1>
              <p className="mt-2 text-sm text-gray-700">
                Below is the data extracted from the URL you provided.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                onClick={() => setTableData([])}
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white
                shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Parse Another URL
              </button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      {tableData[0].map((headerCell, idx) => (
                        <th
                          key={idx}
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-white/75 px-3
                          py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                        >
                          {headerCell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.slice(1).map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={classNames(
                              rowIdx !== tableData.length - 2 ? 'border-b border-gray-200' : '',
                              'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                            )}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
