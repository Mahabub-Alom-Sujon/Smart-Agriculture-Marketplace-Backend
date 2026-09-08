interface IQuery {
    searchTerm?: string;
    productId?: string;
    buyerId?: string;
    orderId?: string;
    rating?: string | number;
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;

    [key: string] : any
}