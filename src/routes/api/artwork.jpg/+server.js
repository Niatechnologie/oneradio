export async function GET() {
  const res = await fetch('https://oneradiomobile.oneradio.ci/oneradiomobile/artwork.jpg');
  return new Response(res.body, {
    headers: {
      'Content-Type': res.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'no-store'
    }
  });
}
