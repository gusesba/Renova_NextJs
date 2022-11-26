import { NextApiRequest, NextApiResponse } from 'next';
import {
  createProduct,
  getProducts,
} from '../../../backend/controllers/product';
import { prisma } from '../../../prisma/prismaClient';
import { Product } from '../../../types/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product | Product[] | { error: string }>
) {
  //IF POST REQUEST CREATE PRODUCT - backend/product.ts
  if (req.method == 'POST' && req.body?.action == 'POST') {
    const {
      price,
      product,
      brand,
      size,
      color,
      providerId,
      description,
      entry,
      sellId,
      sellPrice,
    } = req.body;

    const date = entry ? new Date(entry) : new Date(Date.now());

    return createProduct(
      price,
      product,
      brand,
      size,
      color,
      providerId,
      description,
      date,
      sellId,
      sellPrice
    )
      .then(async (product: Product) => {
        await prisma.$disconnect();
        res.status(201).json(product);
      })
      .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        res.status(500).json({ error: 'Server Side Error' });
      });
  }
  //IF POST REQUEST GET PRODUCTS - backend/product.ts
  if (req.method == 'POST' && req.body?.action == 'GET') {
    const { number, skip, filter, order } = req.body;

    return getProducts(number, skip, filter, order)
      .then(async (products: Product[]) => {
        await prisma.$disconnect();
        res.status(201).json(products);
      })
      .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        res.status(500).json({ error: 'Server Side Error' });
      });
  }
}
