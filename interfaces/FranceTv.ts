export interface FranceTv {
  france2: FranceTvChannel;
  france3: FranceTvChannel;
}

export interface FranceTvChannel {
  label: string
  collections: Collection[]
}

export interface Collection {
  id?: number
  label: string
  items: Item2[]
}

export interface Item2 {
  id: number
  title?: string
}