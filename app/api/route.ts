export async function GET() {
  const france3 = await fetch("https://www.france.tv/france-3/metadata/", {
    headers: {
      Origin: "www.france.tv",
      "Content-Type": "application/json",
    },
    cache:'no-store'
  });

  const france2 = await fetch("https://www.france.tv/france-2/metadata/", {
    headers: {
      Origin: "www.france.tv",
      "Content-Type": "application/json",
    },
    cache:'no-store'
  });

  const parisH24 = await fetch("https://www.france.tv/paris-h24/metadata/", {
    headers: {
      Origin: "www.france.tv",
      "Content-Type": "application/json",
    },
    cache:'no-store'
  });

  const france3json = await france3.json();
  const france2json = await france2.json();
  const parisH24json = await parisH24.json();

  return Response.json({
    france3: france3json,
    france2: france2json,
    parisH24: parisH24json,
  });
}
