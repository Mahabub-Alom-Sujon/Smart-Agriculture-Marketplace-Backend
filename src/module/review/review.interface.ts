
export interface ICreateReview {
  rating: number;
  comment?: string;
  buyerId: string;
  productId: string;
  orderId: string;
}

export interface IUpdateReview {
  rating?: number;
  comment?: string;
}
