export async function fetcher(url: string): Promise<any> {
  const response = await fetch(url);
  return response.json();
}
