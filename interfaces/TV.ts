export interface TV {
  france2: TVChannel;
  france3: TVChannel;
  eurosport1: TVChannel;
  eurosport2: TVChannel;
}

export interface FranceTvChannel {
  label: string;
  collections: Collection[];
}

export interface Collection {
  id?: number;
  label: string;
  items: Item2[];
}

export interface Item2 {
  id: number;
  title?: string;
}

export interface TVChannel {
  position: number;
  title: string;
  url: string;
}
