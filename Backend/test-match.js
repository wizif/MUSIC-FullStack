async function testMatch() {
  const urls = [
    'https://a-v2.sndcdn.com/assets/55-6c1c0dc7.js',
    'https://a-v2.sndcdn.com/assets/56-4684edd2.js',
    'https://a-v2.sndcdn.com/assets/1-ed379c62.js',
    'https://a-v2.sndcdn.com/assets/0-46365d3b.js',
    'https://a-v2.sndcdn.com/assets/2-f5f088da.js',
    'https://a-v2.sndcdn.com/assets/58-e74c1501.js',
    'https://a-v2.sndcdn.com/assets/18-ff44fcdb.js',
    'https://a-v2.sndcdn.com/assets/57-379e3245.js',
    'https://a-v2.sndcdn.com/assets/59-ac0a49ce.js'
  ];

  const clientIdRegex = /,client_id:"([a-zA-Z0-9]{32})"/;
  const fallbackRegex = /client_id[:=]["']([a-zA-Z0-9]{32})["']/i;
  const broadRegex = /client_id[:=]["']?([a-zA-Z0-9]{32})["']?/i;

  for (const url of urls) {
    console.log("Fetching:", url);
    const res = await fetch(url);
    const text = await res.text();
    
    const m1 = text.match(clientIdRegex);
    const m2 = text.match(fallbackRegex);
    const m3 = text.match(broadRegex);
    
    if (m1) console.log("  -> Match 1:", m1[1]);
    if (m2) console.log("  -> Match 2:", m2[1]);
    if (m3) console.log("  -> Match 3:", m3[1]);
  }
}
testMatch().catch(console.error);
