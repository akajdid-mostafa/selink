
'use server';

interface LinkMetadata {
  thumbnailUrl: string | null;
  pageTitle: string;
  faviconUrl: string | null;
}

async function getHtml(url: string): Promise<string | null> {
  let userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('facebook.com') || urlObj.hostname.includes('fb.com')) {
      userAgent = 'facebookexternalhit/1.1';
    }
  } catch (e) {
    // Invalid URL
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': userAgent, 'Accept': 'text/html', 'Accept-Language': 'en-US,en;q=0.9' },
    });
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    return null;
  }
}

function getAttributeValue(attributesString: string, attributeName: string): string | null {
  const regex = new RegExp(`${attributeName}\\s*=\\s*["']([^"']+)["']`, 'i');
  const match = attributesString.match(regex);
  return match ? match[1] : null;
}

function extractPreviewImageUrl(html: string, baseUrl: string): string | null {
  const metaTagMatches = html.matchAll(/<meta\s+([^>]+)>/gi);
  let ogImage: string | null = null;
  let twitterImage: string | null = null;

  for (const match of metaTagMatches) {
    const attrsString = match[1];
    const property = getAttributeValue(attrsString, 'property');
    const name = getAttributeValue(attrsString, 'name');
    const content = getAttributeValue(attrsString, 'content');

    if (content) {
      if (property === 'og:image' || name === 'og:image') ogImage = content;
      if (property === 'twitter:image' || name === 'twitter:image') twitterImage = content;
    }
  }

  let imageUrl = ogImage || twitterImage;

  if (imageUrl) {
    try {
      return new URL(imageUrl, baseUrl).href;
    } catch (e) {
      return null;
    }
  }
  return null;
}

function simpleHtmlEntityDecode(text: string): string {
  return text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0*39;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ');
}

function extractPageTitle(html: string): string | null {
  const metaTagMatches = html.matchAll(/<meta\s+([^>]+)>/gi);
  for (const match of metaTagMatches) {
    const attrsString = match[1];
    const property = getAttributeValue(attrsString, 'property');
    const name = getAttributeValue(attrsString, 'name');
    const content = getAttributeValue(attrsString, 'content');
    if ((property === 'og:title' || name === 'og:title') && content) {
      return simpleHtmlEntityDecode(content).trim() || null;
    }
  }

  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return simpleHtmlEntityDecode(titleMatch[1]).trim() || null;
  }
  return null;
}

function extractFaviconUrl(html: string, baseUrl: string): string | null {
  const linkTagMatches = html.matchAll(/<link\s+([^>]+)>/gi);
  for (const match of linkTagMatches) {
    const attrsString = match[1];
    const href = getAttributeValue(attrsString, 'href');
    const rel = getAttributeValue(attrsString, 'rel');
    if (href && rel && ['icon', 'shortcut icon', 'apple-touch-icon'].includes(rel.toLowerCase())) {
      try {
        return new URL(href, baseUrl).href;
      } catch (e) {
        // continue
      }
    }
  }
  return null;
}

function extractYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;
    const searchParams = urlObj.searchParams;
    if (hostname.includes('youtube.com')) {
      if (pathname.startsWith('/watch')) return searchParams.get('v');
      if (pathname.startsWith('/embed/')) return pathname.substring('/embed/'.length).split('/')[0];
    } else if (hostname.includes('youtu.be')) {
      return pathname.substring(1).split('/')[0];
    }
  } catch (e) { /* ignore */ }
  return null;
}

const isAllowedCdnForKnownSite = (linkHost: string, cdnHost: string): boolean => {
    const normalizedLinkHost = linkHost.replace(/^www\./, '');
    const normalizedCdnHost = cdnHost.replace(/^www\./, '');

    const rules: Record<string, string[]> = {
        'facebook.com': ['.fbcdn.net'],
        'fb.com': ['.fbcdn.net'],
        'reddit.com': ['www.redditstatic.com', '.redd.it'],
        'instagram.com': ['.cdninstagram.com', '.fbcdn.net'],
        'dribbble.com': ['cdn.dribbble.com'],
        'canva.com': ['canva.com'],
        'google.com': ['google.', 'gstatic.com'],
        'yandex.com': ['yastatic.net', 'yandex.net'],
        'behance.net': ['.behance.net'],
        'twitter.com': ['pbs.twimg.com', 'abs.twimg.com'],
        'x.com': ['pbs.twimg.com', 'abs.twimg.com'],
        'shopee.co.id': ['.shopee.co.id', 'susercontent.com'],
        'blibli.com': ['blibli.com', 'static-src.com'],
        'figma.com': ['figma.com', 'figma-alpha-api.s3.amazonaws.com'],
        'framer.com': ['framerusercontent.com', 'framer.media'],
    };

    const cdnList = rules[normalizedLinkHost] || [];
    if (cdnList.some(cdn => normalizedCdnHost.includes(cdn))) return true;

    // Generic fallbacks
    if (['api.microlink.io', 'opengraph.io'].includes(normalizedCdnHost)) return true;

    return false;
};

// Main function to get link metadata
export async function getLinkMetadata(linkUrl: string): Promise<LinkMetadata> {
  const opengraphIoApiKey = process.env.OPENGRAPH_IO_API_KEY;
  const microlinkApiKey = process.env.MICROLINK_API_KEY;

  if (!linkUrl || typeof linkUrl !== 'string' || !linkUrl.trim()) {
    throw new Error("The provided URL is empty or invalid.");
  }

  let normalizedUrl = linkUrl.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  let urlObj: URL;
  try {
    urlObj = new URL(normalizedUrl);
  } catch (e) {
    throw new Error(`The provided URL "${linkUrl.substring(0, 100)}" is invalid.`);
  }

  const metadata: LinkMetadata = {
    pageTitle: urlObj.hostname.replace(/^www\./, ''),
    thumbnailUrl: null,
    faviconUrl: null,
  };

  const linkHostname = urlObj.hostname;

  // --- Special Handlers for known sites (Selink, YouTube, Grok) ---
  if (linkHostname.includes('selink-space.vercel.app')) {
      metadata.pageTitle = 'Selink - Link Manager';
      metadata.thumbnailUrl = 'https://selink-space.vercel.app/og-image.png';
      try {
        metadata.faviconUrl = new URL('/favicon.ico', normalizedUrl).href;
      } catch(e) {/* ignore */}
      return metadata;
  }

  const isGrok = linkHostname.includes('grok.x.ai') || linkHostname.includes('grok.com');
  if (isGrok) {
      metadata.pageTitle = 'Grok';
      metadata.thumbnailUrl = 'https://grok.x.ai/images/grok-og.png';
      metadata.faviconUrl = 'https://grok.x.ai/images/favicon-light.png';
      return metadata;
  }
  
  if (extractYouTubeVideoId(normalizedUrl)) {
    try {
        const videoId = extractYouTubeVideoId(normalizedUrl);
        metadata.thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(normalizedUrl)}&format=json`;
        const oEmbedResponse = await fetch(oEmbedUrl);
        if (oEmbedResponse.ok) {
            const oEmbedData = await oEmbedResponse.json();
            if (oEmbedData.title) metadata.pageTitle = oEmbedData.title;
        }
        metadata.faviconUrl = 'https://www.youtube.com/s/desktop/146f86b1/img/logos/favicon_32x32.png';
        return metadata; // YouTube is special, we can return early
    } catch (e) { /* Fallback to general fetch */ }
  }

  // --- Attempt 1: Standard HTML Scraping (for non-problematic sites) ---
  const serviceReliantDomains = [
    'facebook.com', 'fb.com', 'instagram.com', 'pika.art', 'behance.net', 'figma.com', 'framer.com', 'framer.media',
    'twitter.com', 'x.com', 'canva.com', 'shopee.', 'blibli.com', 'envato.com', 'themeforest.net', 'leonardo.ai'
  ];
  const isServiceReliant = serviceReliantDomains.some(domain => linkHostname.includes(domain));

  if (!isServiceReliant) {
    const htmlContent = await getHtml(normalizedUrl);
    if (htmlContent) {
      metadata.pageTitle = extractPageTitle(htmlContent) || metadata.pageTitle;
      metadata.thumbnailUrl = extractPreviewImageUrl(htmlContent, normalizedUrl);
      metadata.faviconUrl = extractFaviconUrl(htmlContent, normalizedUrl);
    }
  }

  // --- Attempt 2: Service-based Fallback (if scraping failed or was skipped) ---
  if (!metadata.thumbnailUrl) {
    let serviceSuccess = false;
    
    // Try Microlink first, as it supports screenshots
    if (microlinkApiKey) {
      try {
        const microlinkApiUrl = `https://api.microlink.io/?url=${encodeURIComponent(normalizedUrl)}&screenshot=true&meta=true&force=true`;
        const microlinkResponse = await fetch(microlinkApiUrl, { headers: { 'User-Agent': 'SelinkLinkPreview/1.0' } });
        if (microlinkResponse.ok) {
          const microlinkData = await microlinkResponse.json();
          if (microlinkData.status === 'success' && microlinkData.data) {
            const mlData = microlinkData.data;
            const imageFromMicrolink = mlData.image?.url || mlData.screenshot?.url || null;
            
            if (imageFromMicrolink) {
              metadata.thumbnailUrl = imageFromMicrolink;
              serviceSuccess = true;
            }

            // Update title and favicon only if they are better than what we might already have
            if (mlData.title && (metadata.pageTitle === urlObj.hostname.replace(/^www\./, ''))) {
              metadata.pageTitle = mlData.title;
            }
            if (!metadata.faviconUrl && (mlData.favicon?.url || mlData.logo?.url)) {
              metadata.faviconUrl = mlData.favicon?.url || mlData.logo?.url;
            }
          }
        }
      } catch (e) { /* Microlink failed, will try OpenGraph.io next */ }
    }

    // Try OpenGraph.io if Microlink didn't get a thumbnail
    if (!serviceSuccess && opengraphIoApiKey) {
      try {
        const openGraphIoUrl = `https://opengraph.io/api/1.1/site/${encodeURIComponent(normalizedUrl)}?app_id=${opengraphIoApiKey}&full_render=true&cache_ok=false`;
        const ogResponse = await fetch(openGraphIoUrl, { headers: { 'User-Agent': 'SelinkLinkPreview/1.0' } });
        if (ogResponse.ok) {
          const ogData = await ogResponse.json();
          if (ogData.hybridGraph?.image) metadata.thumbnailUrl = ogData.hybridGraph.image;
          
          if (ogData.hybridGraph?.title && (metadata.pageTitle === urlObj.hostname.replace(/^www\./, ''))) {
            metadata.pageTitle = ogData.hybridGraph.title;
          }
          if (!metadata.faviconUrl && ogData.hybridGraph?.favicon) {
            metadata.faviconUrl = ogData.hybridGraph.favicon;
          }
        }
      } catch (e) { /* OpenGraph.io also failed */ }
    }
  }

  // --- Final Cleanup and Post-processing ---
  if (!metadata.faviconUrl) {
    try {
      metadata.faviconUrl = new URL('/favicon.ico', normalizedUrl).href;
    } catch (e) { /* could not construct favicon url */ }
  }

  if (metadata.faviconUrl) {
    try {
        const faviconHostname = new URL(metadata.faviconUrl).hostname;
        if (!metadata.faviconUrl.startsWith('data:image/') && faviconHostname !== linkHostname && !isAllowedCdnForKnownSite(linkHostname, faviconHostname)) {
            metadata.faviconUrl = new URL('/favicon.ico', normalizedUrl).href; // Fallback to root favicon
        }
    } catch (e) {
        metadata.faviconUrl = null;
    }
  }
  
  // Final Title Cleanup
  const host = urlObj.hostname.replace(/^www\./, '');
  // Only apply aggressive title cleaning if it seems generic
  if (metadata.pageTitle.includes('|') || metadata.pageTitle.includes('–')) {
    metadata.pageTitle = metadata.pageTitle.split(/\||–/)[0].trim();
  }

  // If the title is still just the hostname, try to generate one from the path.
  if (metadata.pageTitle.toLowerCase() === host.toLowerCase() && urlObj.pathname.length > 1 && urlObj.pathname !== '/') {
    try {
      const generatedTitle = decodeURIComponent(urlObj.pathname)
        .replace(/^\/|\/$/g, '')
        .replace(/[_-]/g, ' ')
        .split('/')
        .map(part => part.trim())
        .filter(part => part.length > 0)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' / ');

      if (generatedTitle) {
        metadata.pageTitle = generatedTitle;
      }
    } catch (e) { /* Ignore errors during path processing */ }
  }

  if ((host.includes('twitter.com') || host.includes('x.com')) && metadata.pageTitle.toLowerCase() === 'x') {
      const pathUser = urlObj.pathname.split('/')[1];
      if (pathUser && !['home', 'i', 'explore', 'notifications', 'messages'].includes(pathUser)) {
          metadata.pageTitle = `Post by @${pathUser} on X`;
      }
  }


  return metadata;
}
