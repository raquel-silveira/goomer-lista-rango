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

  async findOne({ id }: { id: string }): Promise<IProductsResponse> {
    const productFounded = this.products.find(product => product.id === id);

    if (!productFounded) {
      return null;
    }

    const productPromotion = {
      id: productFounded.id,
      name: productFounded.name,
      price: productFounded.price,
      photo: productFounded.photo,
      category:
        this.categories.find(
          category => category.id === productFounded.category_id,
        )?.name || null,
      promotion:
        this.promotions.find(
          promotion => promotion.product_id === productFounded.id,
        ) || null,
    };

    return productPromotion;
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
  async updateById({
    id,
    name,
    price,
    category_id,
  }: IUpdateProductDTO): Promise<Product> {
    const productFound = this.products.find(product => product.id === id);

    if (!productFound) {
      return null;
    }

    const updatedFields = {
      ...(name ? { name } : {}),
      ...(price ? { price } : {}),
      ...(category_id ? { category_id } : {}),
    };

    const productIndex = this.products.findIndex(product => product.id === id);

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedFields,
    };

    const updatedProduct = { ...this.products[productIndex] };

    return updatedProduct;
  }
  async delete({ id }: { id: string }): Promise<void> {
    this.products = this.products.filter(product => product.id !== id);
  }
  async updatePhotoById({
    id,
    photoFilename,
  }: {
    id: string;
    photoFilename: string;
  }): Promise<Product> {
    const productFound = this.products.find(product => product.id === id);

    if (!productFound) {
      return null;
    }

    const productIndex = this.products.findIndex(product => product.id === id);

    this.products[productIndex].photo = photoFilename;

    const updatedPhotoProduct = { ...this.products[productIndex] };

    return updatedPhotoProduct;
  }
}

export { ProductsRepositoryInMemory };
