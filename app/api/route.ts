import { FranceTvChannel } from "@/interfaces/TV";
import { parse } from "node-html-parser/dist/nodes/html";

export async function GET() {
  const france3 = await fetch(
    "https://api-mobile.yatta.francetv.fr/apps/channels/france-3?platform=apps",
    {
      headers: {
        "User-Agent": "ftv_apps_android",
        X_API_VERSION: "1",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  const france2 = await fetch(
    "https://api-mobile.yatta.francetv.fr/apps/channels/france-2?platform=apps",
    {
      headers: {
        "User-Agent": "ftv_apps_android",
        X_API_VERSION: "1",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  const france3json: FranceTvChannel = await france3.json();
  const france2json: FranceTvChannel = await france2.json();
  const france2jsonClean = {
    title: france2json.collections.filter(
      (collection) => collection.label === "En direct",
    )[0].items[0].title,
    url: "https://www.france.tv/france-2/direct.html",
  };

  const france3jsonClean = {
    title: france3json.collections.filter(
      (collection) => collection.label === "En direct",
    )[0].items[0].title,
    url: "https://www.france.tv/france-3/direct.html",
  };

  france3json.collections.filter(
    (collection) => collection.label === "En direct",
  );

  const response = await fetch("https://www.eurosport.fr/watch/");
  const html = await response.text();
  const root = parse(html);

  const titleNodes = root.querySelectorAll(".text-card-default-text-title-02");

  const results = titleNodes.slice(0, 2).map((titleNode, index) => {
    const title = titleNode.text.trim();

    let parent = titleNode.parentNode;
    let url = "Lien non trouvé (ou géré par Javascript)";

    for (let i = 0; i < 10; i++) {
      if (!parent) break;
      if (parent.tagName === "A") {
        url = parent.getAttribute("href") || "";
        break;
      }
      parent = parent.parentNode;
    }

    return {
      title: title,
      url: url,
    };
  });
  return Response.json({
    france3: france3jsonClean,
    france2: france2jsonClean,
    eurosport1: results[0],
    eurosport2: results[1],
  });
}
