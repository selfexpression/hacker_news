export type Story = {
  by: string;
  descendants: number;
  id: number;
  kids?: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
};

export type Comment = {
  by : string;
  id : number;
  kids? : number[];
  parent : number;
  text : string;
  time : number;
  type : string;
}

export type TreeNode = {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: TreeNode[];
  loaded?: boolean;
  icon?: JSX.Element | boolean;
}
