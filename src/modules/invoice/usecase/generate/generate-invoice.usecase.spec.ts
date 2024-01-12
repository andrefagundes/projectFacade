import GenerateInvoiceUseCase from './generate-invoice.usecase'

const mockRepository = () => {
  return {
    find: jest.fn(),
    generate: jest.fn(),
  }
}

describe('Generate invoice usecase unit test', () => {
  it('should generate a invoice', async () => {
    const invoiceRepository = mockRepository()
    const usecase = new GenerateInvoiceUseCase(invoiceRepository)

    const input = {
      name: 'André M Fagundes',
      document: '92902154687',
      street: 'Rua João José',
      number: '425',
      city: 'João Pinheiro',
      state: 'Minas Gerais',
      zipCode: '38770000',
      complement: 'Casa amarela',
      items: [
        {
          id: '1',
          name: 'Produto 1',
          price: 15,
        },
        {
          id: '2',
          name: 'Produto 2',
          price: 30,
        },
      ],
    }

    const result = await usecase.execute(input)

    expect(result.id).toBeDefined()
    expect(result.name).toBe(input.name)
    expect(result.document).toBe(input.document)
    expect(result.city).toBe(input.city)
    expect(result.total).toBe(45)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].id).toBe(input.items[0].id)
    expect(result.items[0].name).toBe(input.items[0].name)
    expect(result.items[0].price).toBe(input.items[0].price)
    expect(result.items[0].price).toBe(input.items[0].price)
    expect(result.items[1].id).toBe(input.items[1].id)
    expect(result.items[1].name).toBe(input.items[1].name)
    expect(result.items[1].price).toBe(input.items[1].price)
  })
})
