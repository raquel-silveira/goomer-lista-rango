import { ICreateProductDTO } from '@modules/products/dtos/ICreateProductDTO';
import { IUpdateProductDTO } from '@modules/products/dtos/IUpdateProductDTO';
import { Category } from '@modules/products/infra/postgres/entities/Category';
import { Product } from '@modules/products/infra/postgres/entities/Product';
import { Promotion } from '@modules/products/infra/postgres/entities/Promotion';

import { IProductsRepository, IProductsResponse } from '../IProductsRepository';

class ProductsRepositoryInMemory implements IProductsRepository {
  products: Product[] = [];

  constructor(
    private promotions: Promotion[] = [],
    private categories: Category[] = [],
  ) {}
  async create({
    id,
    name,
    price,
    category_id,
    restaurantId,
  }: ICreateProductDTO): Promise<Product> {
    const product = new Product();

    Object.assign(product, {
      id,
      name,
      price,
      category_id,
      restaurant_id: restaurantId,
    });

    this.products.push(product);

    return product;
  }
  async findByRestaurantId({
    restaurantId,
  }: {
    restaurantId: string;
  }): Promise<IProductsResponse[]> {
    const productsFounded = this.products.filter(
      product => product.restaurant_id === restaurantId,
    );

    if (!productsFounded) {
      return null;
    }

    const productPromotion = productsFounded.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      photo: product.photo,
      category:
        this.categories.find(category => category.id === product.category_id)
          ?.name || null,
      promotion:
        this.promotions.find(
          promotion => promotion.product_id === product.id,
        ) || null,
    }));

    return productPromotion;
  }
  async updateById({ id, name, price }: IUpdateProductDTO): Promise<Product> {
    throw new Error('Method not implemented.');
  }
  async delete({ id }: { id: string }): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async updatePhotoById({
    id,
    photoFilename,
  }: {
    id: string;
    photoFilename: string;
  }): Promise<Product> {
    throw new Error('Method not implemented.');
  }
}

export { ProductsRepositoryInMemory };
