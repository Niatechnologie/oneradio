import { json } from '@sveltejs/kit';

export async function GET() {
  const res = await fetch('https://oneradiomobile.oneradio.ci/oneradiomobile/nowplaying.txt');
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  return json({
    current: lines[0]?.trim() || '',
    next: lines[1]?.trim() || ''
  });
}
