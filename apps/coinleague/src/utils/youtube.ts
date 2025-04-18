export function youTubeUrlToEmbed(url: string) {
  try {
    const tempUrlObj = new URL(url);

    if (tempUrlObj.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${tempUrlObj.pathname}`;
    }

    if (tempUrlObj.pathname.startsWith('/embed')) {
      return url;
    }

    const videoIdParam = tempUrlObj.searchParams.get('v');

    if (videoIdParam) {
      return `https://www.youtube.com/embed/${videoIdParam}`;
    }
  } catch (err) {
    return;
  }
}
