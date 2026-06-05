// Wide Shield

export async function checkEdgeRateLimit(ip: string) {
  const WEBDIS_URL = process.env.WEBDIS_URL;
  const WEBDIS_USER = process.env.WEBDIS_USER;
  const WEBDIS_PASS = process.env.WEBDIS_PASSWORD;
  const basicAuthHeader = `Basic ${btoa(`${WEBDIS_USER}:${WEBDIS_PASS}`)}`;
  const limit = 100;
  const windowSeconds = 60;
  const key = `rate_limit_${ip}`;
  try {
    console.log("Auth Header: ", basicAuthHeader);
    const incrResponse = await fetch(`${WEBDIS_URL}/INCR/${key}`, {
      headers: { Authorization: basicAuthHeader },
      cache: "no-store",
    });
    if (!incrResponse.ok) {
      throw new Error(`Webdis connection failed: ${incrResponse.statusText}`);
    }
    const incrData = await incrResponse.json();
    const currentCount = incrData.INCR;
    if (currentCount === 1) {
      fetch(`${WEBDIS_URL}/EXPIRE/${key}/${windowSeconds}`, {
        headers: { Authorization: basicAuthHeader },
        cache: "no-store",
      }).catch(console.error);
    }
    if (currentCount > limit) {
      return { success: false, limit, currentCount };
    }
    return { success: true, limit, currentCount };
  } catch (error) {
    console.error("Webdis error: ", error);
    return { success: true };
  }
}
