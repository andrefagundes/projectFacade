export interface FindInvoiceUseCaseInputDTO {
  id: string
}

export interface FindInvoiceUseCaseOutputDTO {
  id: string
  name: string
  document: string
  address: {
    street: string
    number: string
    city: string
    state: string
    zipCode: string
    complement: string
  }
  items: {
    id: string
    name: string
    price: number
  }[]
  total: number
  createdAt: Date
}
