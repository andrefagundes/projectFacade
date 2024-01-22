export interface PlaceOrderInputDto {
  client_id: string
  products: {
    productId: string
  }[]
}

export interface PlaceOrderOutputDto {
  id: string
  invoiceId: string
  status: string
  total: number
  products: {
    productId: string
  }[]
}
