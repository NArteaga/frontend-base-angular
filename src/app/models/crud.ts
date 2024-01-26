export interface Filters {
  label: string;
  control: string;
  type: 'text' | 'chip' | 'select' | 'number';
  style?: string;
  inputUpper?: boolean;
  options?: Array<Option<any, any>>;
}

export interface Option<l, v> {
  label: l;
  value: v;
}

export interface Column {
  label: string;
  key: string;
  aling?: string;
}
