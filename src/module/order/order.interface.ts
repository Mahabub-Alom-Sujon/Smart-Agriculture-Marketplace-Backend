export interface ICreateOrderItem {
    productId: string;
    quantity: number;
}

export interface ICreateOrder {
    buyerId: string;
    deliveryAddress: string;
    items: ICreateOrderItem[];
}