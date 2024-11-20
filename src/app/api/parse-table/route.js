import { NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';

const MISTRAL_API_KEY = 'lfCg0qDdHveTvYjVBem95CMwEcdocpwj'; // Set your Mistral API key in .env.local

const client = new Mistral({ apiKey: MISTRAL_API_KEY });

async function fetchHTML(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }
  return response.text();
}

function extractBodyContent(htmlContent) {
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : htmlContent;
}

async function getTableDataFromMistral(bodyContent) {
  const prompt = `
You are a helpful assistant. Extract all tabular data from the following HTML content. Return the data as a JSON array of rows, where each row is an array of cell contents. Ignore tables that are purely for layout or styling purposes. **Output only the JSON array, without any additional text or formatting.** Here's the HTML:

${bodyContent}

Ensure the output is in the following format:
[
  ["Column 1 Header", "Column 2 Header", "Column 3 Header"],
  ["Row 1 Cell 1", "Row 1 Cell 2", "Row 1 Cell 3"],
  ["Row 2 Cell 1", "Row 2 Cell 2", "Row 2 Cell 3"]
]
`;

  try {
    const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: prompt }],
    });

    const tableDataRaw = chatResponse.choices[0]?.message?.content;

    if (!tableDataRaw) {
      throw new Error('Failed to extract table data from Mistral response.');
    }

    // Remove code fences and any leading/trailing whitespace
    const tableDataCleaned = tableDataRaw
      .trim()
      .replace(/^```(?:json)?\n?/, '')
      .replace(/```$/, '');

    // Parse the cleaned JSON string
    const tableData = JSON.parse(tableDataCleaned);

    return tableData;
  } catch (error) {
    throw new Error(`Mistral API call failed: ${error.message}`);
  }
}

export async function POST(req) {
  try {
    console.log(req);
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the HTML content of the URL
    const htmlContent = await fetchHTML(url);

    console.log(htmlContent);

    // Extract body content
    let bodyContent = extractBodyContent(htmlContent);

    // Estimate token count and truncate if necessary
    const maxTokens = 131072; // Maximum tokens for the model
    const estimatedTokens = Math.ceil(bodyContent.length / 4); // Rough estimate: 1 token ≈ 4 characters
    console.log('Estimated tokens:', estimatedTokens);
    if (estimatedTokens > maxTokens) {
      // Truncate the body content to fit within the token limit
      const allowedLength = maxTokens * 4;
      bodyContent = bodyContent.substring(0, allowedLength);
    }

    // Use Mistral to extract table data
    const tableData = await getTableDataFromMistral(bodyContent);

    return NextResponse.json({ tableData });
  } catch (error) {
    console.error('Error parsing table:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse table' },
      { status: 500 }
    );
  }
}
