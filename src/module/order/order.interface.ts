export interface ICreateOrderItem {
    productId: string;
    quantity: number;
}

export interface ICreateOrder {
    buyerId: string;
    deliveryAddress: string;
    items: ICreateOrderItem[];
}

export interface IOrderQuery {
    page?: string;
    limit?: string;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}