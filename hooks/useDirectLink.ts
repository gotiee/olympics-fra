import { Event } from "@/interfaces/Event";
import { TV, TVChannel } from "@/interfaces/TV";
import { useState, useEffect } from "react";

export type DirectLinkResult = {
  link: string;
  channelKey: string;
  logo: string;
  title: string;
};

const useDirectsLinks = (event: Event | null, tv: TV | undefined) => {
  const [directLinks, setDirectLinks] = useState<DirectLinkResult[]>([]);

  useEffect(() => {
    if (!tv || !event) {
      setDirectLinks([]);
      return;
    }

    const channelsConfig = [
      {
        key: "france2",
        logo: process.env.NEXT_PUBLIC_FRANCE_2_LOGO || "",
      },
      {
        key: "france3",
        logo: process.env.NEXT_PUBLIC_FRANCE_3_LOGO || "",
      },
      {
        key: "eurosport1",
        logo: process.env.NEXT_PUBLIC_EUROSPORT_1_LOGO || "",
      },
      {
        key: "eurosport2",
        logo: process.env.NEXT_PUBLIC_EUROSPORT_2_LOGO || "",
      },
    ];

    const normalize = (str: string) =>
      str
        .toLowerCase()
        .replace("-", " ")
        .replace("volleyball de plage", "beach volley")
        .replace(/ball|slalom/gi, "")
        .trim();

    const excludedWords = ["cyclisme", "kayak"];
    const removeExcludedWords = (str: string, words: string[]) =>
      words.reduce(
        (acc, word) => acc.replace(new RegExp(`\\b${word}\\b`, "gi"), ""),
        str,
      );

    const normalizedEventDiscipline = normalize(
      removeExcludedWords(event.disciplineName || "", excludedWords),
    );

    const matches: DirectLinkResult[] = [];

    for (const config of channelsConfig) {
      const tvData = tv as any;
      const channelData = tvData[config.key] as TVChannel | undefined;

      if (channelData && channelData.title) {
        const channelProgramTitle = normalize(channelData.title);

        if (channelProgramTitle.includes(normalizedEventDiscipline)) {
          matches.push({
            link: channelData.url || "",
            channelKey: config.key,
            logo: config.logo,
            title: channelData.title,
          });
        }
      }
    }

    setDirectLinks(matches);
  }, [event, tv]);

  return directLinks;
};

export default useDirectsLinks;
