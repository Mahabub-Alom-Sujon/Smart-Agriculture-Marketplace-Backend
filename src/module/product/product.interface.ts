import { ProductStatus } from '../../../generated/prisma/enums';

export interface CreateProduct {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    unit?: string;
    image?: string;
    categoryId: string;
    farmerId: string;
}

export interface UpdateProduct {
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    unit?: string;
    image?: string;
    categoryId?: string;
    status?: ProductStatus;
}

export interface IProductQuery{
    searchTerm?: string;
    categoryId?: string;
    farmerId?: string;
    status?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}