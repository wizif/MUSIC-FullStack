async function testHtml() {
  console.log("Fetching soundcloud.com...");
  const response = await fetch('https://soundcloud.com', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await response.text();
  console.log("HTML length:", html.length);
  
  const scriptRegex = /<script[^>]+src=["']([^"']+)["']/g;
  let match;
  console.log("Script tags found:");
  while ((match = scriptRegex.exec(html)) !== null) {
    console.log(" - ", match[1]);
  }
}
testHtml().catch(console.error);
