import { NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';


const MISTRAL_API_KEY = 'lfCg0qDdHveTvYjVBem95CMwEcdocpwj'; // Set your Mistral API key in .env.local

const client = new Mistral({apiKey: MISTRAL_API_KEY});

async function fetchHTML(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }
  return response.text();
}

async function getTableDataFromMistral(htmlContent) {
  const prompt = `
You are a helpful assistant. Extract all tabular data from the following HTML content. Return the data as a JSON array of rows, where each row is an array of cell contents. Ignore tables that are purely for layout or styling purposes. Here's the HTML:

${htmlContent}

Ensure the output is in the following format:
[
  ["Column 1 Header", "Column 2 Header", "Column 3 Header"],
  ["Row 1 Cell 1", "Row 1 Cell 2", "Row 1 Cell 3"],
  ["Row 2 Cell 1", "Row 2 Cell 2", "Row 2 Cell 3"]
]
`;

  const chatResponse = await client.chat.complete({
    model: 'mistral-large-latest',
    messages: [{role: 'user', content: prompt}],
  });

  if (!response.ok) {
    throw new Error(`Mistral API call failed: ${response.statusText}`);
  }

  const result = await response.json();
  const tableData = result.choices[0]?.message?.content;

  if (!tableData) {
    throw new Error('Failed to extract table data from Mistral response.');
  }

  return JSON.parse(tableData); // Assuming the model returns JSON
}

export async function POST(req) {
  try {

    console.log(req)
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }



    // Fetch the HTML content of the URL
    const htmlContent = await fetchHTML(url);

    console.log(htmlContent)

    // Use Mistral to extract table data
    const tableData = await getTableDataFromMistral(htmlContent);

    return NextResponse.json({ tableData });
  } catch (error) {
    console.error('Error parsing table:', error);
    return NextResponse.json({ error: error.message || 'Failed to parse table' }, { status: 500 });
  }
}
