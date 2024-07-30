import { Event } from "@/interfaces/Event";
import { FranceTv } from "@/interfaces/FranceTv";
import { useState, useEffect } from "react";

const useDirectLink = (event: Event, franceTv?: FranceTv) => {
  const [direct, setDirect] = useState<{
    link: string;
    channel: string;
    showAd: boolean;
    logo: string;
  } | null>(null);

  useEffect(() => {
    if (!franceTv || !event) return;

    const channels = [
      { key: "france2", id: "france-2" },
      { key: "france3", id: "france-3" },
      { key: "parisH24", id: "paris-h24" },
    ];

    const normalize = (str: string) =>
      str
        .toLowerCase()
        .replace("-", "")
        .replace("volleyball de plage", "beach volley")
        .replace("ball", "")
        .replace("slalom", "");

    const excludedWords = ["cyclisme ", "kayak"];
    const excludeWords = (str: string, words: string[]) =>
      words.reduce(
        (acc, word) => acc.replace(new RegExp(`\\b${word}\\b`, "gi"), ""),
        str
      );

    const eventTitle = normalize(
      excludeWords(event.disciplineName.toLowerCase(), excludedWords)
    );

    for (const channel of channels) {
      const tmp = franceTv as any;
      const channelData = tmp[channel.key];
      if (channelData) {
        const normalizedAdditionalTitle = normalize(
          channelData.additionalTitle
        );

        if (normalizedAdditionalTitle.includes(eventTitle)) {
          setDirect({
            link: `${process.env.NEXT_PUBLIC_FRANCE_TV_API}${channel.id}${process.env.NEXT_PUBLIC_FRANCE_TV_API_ENDING}`,
            channel: channelData.name,
            showAd: channelData.showAd,
            logo: channelData.logo,
          });
          break;
        }
      }
    }
  }, [event, franceTv]);

  return direct;
};

export default useDirectLink;
