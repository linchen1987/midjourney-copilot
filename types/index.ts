export type Segment = {
  id?: string;
  text: string;
  tag?: string;
  textColor?: string;
};

export type Categories = Record<
  string,
  {
    id?: string;
    name: string;
    tag?: string;
    textColor?: string;
  }
>;
