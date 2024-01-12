
import Address from '../../../@shared/domain/value-object/address'
import InvoiceItem from '../../domain/invoice-item.entity'
import Invoice from '../../domain/invoice.entity'
import FindInvoiceUseCase from './find-invoice.usecase'

const address = new Address({
  street: 'Rua João José',
  number: '425',
  city: 'João Pinheiro',
  state: 'MG',
  zipCode: '38770000',
  complement: 'Casa Amarela'
})

const item1 = new InvoiceItem({
  name: 'Produto 1',
  price: 15,
})

const item2 = new InvoiceItem({
  name: 'Produto 2',
  price: 29,
})

const items = [item1, item2]

const invoice = new Invoice({
  name: 'André M Fagundes',
  document: '92902154687',
  address: address,
  items: items,
})

const mockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    generate: jest.fn(),
  }
}

describe('Find invoice usecase unit test', () => {
  it('should find an invoice', async () => {
    const invoiceRepository = mockRepository()
    const usecase = new FindInvoiceUseCase(invoiceRepository)

    const input = {
      id: '1',
    }

    const result = await usecase.execute(input)

    expect(result.id).toBe(invoice.id.id)
    expect(result.total).toBe(44)
    expect(invoiceRepository.find).toBeCalledTimes(1)
    expect(result.name).toBe('André M Fagundes')
    expect(result.document).toBe('92902154687')
    expect(result.address.city).toBe(address.city) 
    expect(result.address.street).toBe(address.street) 
    expect(result.address.number).toBe(address.number) 
    expect(result.items[0].id).toBe(items[0].id.id)
    expect(result.items).toHaveLength(2)
  })
})
