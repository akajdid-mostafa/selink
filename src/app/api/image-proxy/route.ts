
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('URL parameter is missing', { status: 400 });
  }

  try {
    new URL(imageUrl);
  } catch (error) {
    return new NextResponse('Invalid URL parameter', { status: 400 });
  }

  try {
    // Make the request less restrictive to improve compatibility with various CDNs.
    // We removed the specific 'Accept' header and the strict content-type check below.
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch image via proxy: ${imageUrl}, status: ${response.status}`);
      return new NextResponse(null, { status: response.status, statusText: response.statusText });
    }

    const imageBuffer = await response.arrayBuffer();
    // Get the original content-type, or fallback to a generic one if it's missing.
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // By removing the strict content-type check, we let the browser decide if it can render the data.
    // This is more robust and works with more CDNs.
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable', 
      },
    });
  } catch (error) {
    console.error(`Error proxying image ${imageUrl}:`, error);
    return new NextResponse(null, { status: 500, statusText: "Internal Server Error" }); 
  }
}
