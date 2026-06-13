const BASE = 'https://adminradio.oneradio.ci/radio_one';

export async function load({ fetch, params }) {
  const { spectacleId } = params;

  try {
    const res  = await fetch(`${BASE}/spectacle-details.php?id=${spectacleId}`);
    const data = await res.json();

    if (!data.success) {
      return { spectacle: null, status: 'not_found' };
    }

    return { spectacle: data.spectacle, status: 'success' };
  } catch (e) {
    return { spectacle: null, status: 'error' };
  }
}
