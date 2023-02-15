import { prisma } from '../../prisma/prismaClient';

//CREATE SELL
//PARAMS
//  TYPE  : STRING
//  BUYERID : NUMBER
//  PRODUCTS : ID
export async function createSell(
  type: string,
  buyerId: number,
  products: [{}]
) {
  const sell = await prisma.sell.create({
    data: {
      type,
      buyerId,
    },
  });
  products.forEach(async (product: any) => {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        sellId: sell.id,
        sellPrice: type == 'Venda' ? product.sellPrice : 0,
      },
    });
  });
  return sell;
}

export async function deleteSells(ids: Array<number>) {
  const sells = await prisma.sell.findMany({
    where: {
      id: { in: ids },
    },
    include: {
      products: true, // inclui os produtos vinculados à venda
    },
  });
  sells.forEach((sell) => {
    if (sell.products.length > 0) {
      const index = ids.indexOf(sell.id);

      ids.splice(index, 1);
    }
  });

  const count = await prisma.sell.deleteMany({
    where: { id: { in: ids } },
  });
  return count;
}

export async function getRecipt(take?: number, skip?: number) {
  const sells = await prisma.sell.findMany({
    take,
    skip,
    select: {
      id: true,
      type: true,
      buyer: { select: { name: true } },
      products: {
        select: {
          id: true,
          sellPrice: true,
        },
      },
    },
    orderBy: [{ id: 'desc' }],
  });

  const sellList = sells.map((sell) => {
    const totalProducts = sell.products.length;
    const totalSellPrice = sell.products.reduce(
      (acummulator: any, current: any) => {
        return parseFloat(acummulator) + parseFloat(current.sellPrice);
      },
      0.0
    );
    return {
      id: sell.id,
      type: sell.type,
      buyer: sell.buyer.name,
      totalProducts,
      totalSellPrice,
    };
  });

  return sellList;
}
