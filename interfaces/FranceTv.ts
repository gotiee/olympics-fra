export interface FranceTvChannel {
  name: string;
  logo: string;
  id: string;
  title: string;
  additionalTitle: string;
  preTitle: string;
  beginDate: string;
  endDate: string;
  duration: number;
  progress: number;
  refresh: number;
  layerType: string;
  showAd: boolean;
  chattable: boolean;
}

export interface FranceTv {
  france2: FranceTvChannel;
  france3: FranceTvChannel;
  parisH24: FranceTvChannel;
}
