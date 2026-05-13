export type Warehouse = {
  id: string;
  name: string;
};

export type Inventory = {
  id: string;
  totalStock: number;
  reservedStock: number;
  warehouse: Warehouse;
};

export type Product = {
  id: string;
  name: string;
  inventories: Inventory[];
};