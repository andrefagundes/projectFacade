import { Sequelize } from 'sequelize-typescript'
import InvoiceFacadeFactory from '../factory/invoice.factory'
import { InvoiceItemModel } from '../repository/invoice-items.model'
import { InvoiceModel } from '../repository/invoice.model'

describe('Invoice facade test', () => {
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

  it('should create an invoice', async () => {
    const facade = InvoiceFacadeFactory.create()

    const input = {
      id: '1',
      name: 'André Maciel',
      document: '92954625135',
      street: 'Rua João José',
      number: '425',
      complement: 'Casa Amarela',
      zipCode: '38770000',
      city: 'João Pinheiro',
      state: 'MG',
      items: [
        {
          id: '3',
          name: 'Product 3',
          price: 32,
        },
        {
          id: '4',
          name: 'Product 4',
          price: 50,
        },
      ],
    }

    await facade.generate(input)

    const invoice = await InvoiceModel.findOne({
      where: { id: input.id },
      include: ['items'],
    })

    expect(invoice).not.toBeNull()
    expect(invoice.id).toBe('1')
    expect(invoice.name).toBe('André Maciel')
    expect(invoice.document).toBe('92954625135')
    expect(invoice.street).toBe('Rua João José')
    expect(invoice.number).toBe('425')
    expect(invoice.complement).toBe('Casa Amarela')
    expect(invoice.zipCode).toBe('38770000')
    expect(invoice.city).toBe('João Pinheiro')
    expect(invoice.state).toBe('MG')
    expect(invoice.items).toHaveLength(2)
  })

  it('should find a invoice', async () => {
    const facade = InvoiceFacadeFactory.create()

    const input = {
      id: '2',
      name: 'André Maciel',
      document: '92954625135',
      street: 'Rua João José',
      number: '425',
      complement: 'Casa Amarela',
      zipCode: '38770000',
      city: 'João Pinheiro',
      state: 'MG',
      items: [
        {
          id: '1',
          name: 'Product 1',
          price: 26,
        },
        {
          id: '2',
          name: 'Product 2',
          price: 44,
        },
      ],
    }

    await facade.generate(input)

    const result = await facade.find({ id: '2' })

    expect(result.id).toBe('2')
    expect(result.name).toBe('André Maciel')
    expect(result.document).toBe('92954625135')
    expect(result.address.street).toBe('Rua João José')
    expect(result.address.number).toBe('425')
    expect(result.address.complement).toBe('Casa Amarela')
    expect(result.address.zipCode).toBe('38770000')
    expect(result.address.city).toBe('João Pinheiro')
    expect(result.address.state).toBe('MG')

    expect(result.items).toHaveLength(2)

    expect(result.items[0].id).toBe('1')
    expect(result.items[0].name).toBe('Product 1')
    expect(result.items[0].price).toBe(26)

    expect(result.items[1].id).toBe('2')
    expect(result.items[1].name).toBe('Product 2')
    expect(result.items[1].price).toBe(44)

    expect(result.total).toBe(70)
  })
})
