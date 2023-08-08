export type ToDoItem = {
    id: string;
    value: string;
  };

  export type StoreItem = {
    id: string;
    name: string;
    description: string;
    created: Date;
    lat: string;
    lng: string;
    tags: string;
    category: string;
    subcategory: string;
  };

  export type ReceiptItem = {
    id: string;
    reference: string;
    store: string;
    date: Date,
    category: string;
    tags: string;
  };