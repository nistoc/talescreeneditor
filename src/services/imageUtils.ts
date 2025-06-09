export async function getScenarioImageUrl(scenarioId: string, imageName: string): Promise<string | null> {
  const sources = [
    `/scenarios/${scenarioId}/assets/${imageName}`,
    `https://screen-editor-dev.onrender.com/projects/${scenarioId}/assets/${imageName}`,
    `https://screen-editor-prep.onrender.com/projects/${scenarioId}/assets/${imageName}`,
  ];

  for (const url of sources) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) {
        return url;
      }
    } catch (e) {
      // ignore fetch errors, try next
    }
  }
  return null;
} 