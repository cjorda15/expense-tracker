export interface TableRowColumn {
    content: string | number;
    type: 'text' | 'input' | 'date';
    class?: string;
  }
  
  export interface TableHeader {
    key: string;
    label: string;  // Column label
    sortable?: boolean;  // Can be sorted
  }
  
  export interface TableRow<T = any> {
    data: T;  // The data for each row
    [key: string]: TableRowColumn | T;  // Dynamic columns
  }