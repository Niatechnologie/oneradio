const BASE = 'https://adminradio.oneradio.ci/radio_one';

export async function load({ fetch, params }) {
  const { humoristId } = params;

  try {
    const [resHum, resSpec] = await Promise.all([
      fetch(`${BASE}/humoriste-details.php?id=${humoristId}`),
      fetch(`${BASE}/spectacles.php?humoriste_id=${humoristId}&limit=20`),
    ]);

    const dataHum  = await resHum.json();
    const dataSpec = resSpec.ok ? await resSpec.json() : { success: false };

    if (!dataHum.success) {
      return { humoriste: null, spectacles: [], status: 'not_found' };
    }

    return {
      humoriste:  dataHum.humoriste,
      spectacles: dataSpec.success ? dataSpec.spectacles : [],
      status:     'success',
    };
  } catch (e) {
    return { humoriste: null, spectacles: [], status: 'error' };
  }
}
