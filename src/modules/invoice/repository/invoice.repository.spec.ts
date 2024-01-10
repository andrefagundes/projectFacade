import { Sequelize } from 'sequelize-typescript'
import Address from '../../@shared/domain/value-object/address'
import Id from '../../@shared/domain/value-object/id.value-object'
import InvoiceItem from '../domain/invoice-item.entity'
import Invoice from '../domain/invoice.entity'
import { InvoiceItemModel } from './invoice-items.model'
import { InvoiceModel } from './invoice.model'
import InvoiceRepository from './invoice.repository'

const item1 = new InvoiceItem({
  id: new Id('1'),
  name: 'Product 1',
  price: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const item2 = new InvoiceItem({
  id: new Id('2'),
  name: 'Product 2',
  price: 15,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const props = {
  id: new Id('1'),
  name: 'Invoice T',
  document: '92965489756',
  createdAt: new Date(),
  updatedAt: new Date(),
  address: new Address({
    street: 'Rua João José',
    number: '432',
    complement: 'Casa Amarela',
    zipCode: '123456',
    city: 'João Pinheiro',
    state: 'MG',
  }),
  items: [item1, item2],
}

describe('Invoice Repository unit test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    await sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should generate a new invoice', async () => {
    const invoiceRepository = new InvoiceRepository()

    const invoice = new Invoice(props)

    await invoiceRepository.generate(invoice)

    const result = await invoiceRepository.find(invoice.id.id)

    expect(result.id.id).toBe('1')
    expect(result.name).toBe('Invoice T')
    expect(result.document).toBe('92965489756')
    expect(result.address.street).toBe('Rua João José')
    expect(result.address.number).toBe('432')
    expect(result.address.complement).toBe('Casa Amarela')
    expect(result.address.zipCode).toBe('123456')
    expect(result.address.city).toBe('João Pinheiro')
    expect(result.address.state).toBe('MG')
    expect(result.items.length).toBe(2)
    expect(result.items[0].id.id).toBe('1')
    expect(result.items[0].name).toBe('Product 1')
    expect(result.items[0].price).toBe(10)
    expect(result.items[1].id.id).toBe('2')
    expect(result.items[1].name).toBe('Product 2')
    expect(result.items[1].price).toBe(15)
  })

  it('should find a invoice', async () => {
    const invoiceRepository = new InvoiceRepository()

    const invoice = new Invoice(props)

    await invoiceRepository.generate(invoice)

    const result = await invoiceRepository.find('1')

    expect(result.id.id).toBe('1')
    expect(result.name).toBe('Invoice T')
    expect(result.document).toBe('92965489756')
    expect(result.address.street).toBe('Rua João José')
    expect(result.address.number).toBe('432')
    expect(result.address.complement).toBe('Casa Amarela')
    expect(result.address.zipCode).toBe('123456')
    expect(result.address.city).toBe('João Pinheiro')
    expect(result.address.state).toBe('MG')
    expect(result.items.length).toBe(2)
    expect(result.items[0].id.id).toBe('1')
    expect(result.items[0].name).toBe('Product 1')
    expect(result.items[0].price).toBe(10)
    expect(result.items[1].id.id).toBe('2')
    expect(result.items[1].name).toBe('Product 2')
    expect(result.items[1].price).toBe(15)
  })
})
