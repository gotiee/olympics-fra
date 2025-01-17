export interface Competitor {
  code: string;
  noc: string;
  name: string;
  order: number;
  results: {
    position: string;
    mark: string;
    winnerLoserTie: string;
    medalType: string;
    detailedMark: Array<Array<number>>;
    irm: string;
  };
}
