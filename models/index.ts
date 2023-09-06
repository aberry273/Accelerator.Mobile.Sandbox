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
  

  export type FileItem = {
    id: string;
    storeId: string;
    file: string;
    name: string;
    date: Date,
    category: string;
    tags: string;
  };