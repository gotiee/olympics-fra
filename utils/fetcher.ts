export async function fetcher(url: string): Promise<any> {
  const response = await fetch(url);
  return response.json();
}

export async function fetcherFranceTv(url: string): Promise<any> {
  const response = await fetch(url, {
    headers: {
      Origin: "https://www.france.tv",
    },
  });
  return response.json();
}
