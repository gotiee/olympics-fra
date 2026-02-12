export interface MedalEntry {
  organisation: string;
  description: string;
  longDescription: string;
  rank: number;
  sortRank: number;
  rankTotal: number;
  sortTotalRank: number;
  medalsNumber: {
    type: string;
    gold: number;
    silver: number;
    bronze: number;
    total: number;
  }[];
  total: number;
  disciplines: null;
}
