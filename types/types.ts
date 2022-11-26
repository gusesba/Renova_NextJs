import { Decimal } from '@prisma/client/runtime';

export type Client = {
  id?: number;
  phone?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Product = {
  price?: Decimal;
  product?: string;
  brand?: string;
  size?: string;
  color?: string;
  providerId?: number;
  description?: string | null;
  entry?: Date;
  sellId?: number | null;
  sellPrice?: Decimal | null;
  createdAt?: Date;
  updatedAt?: Date;
};
