import { InvoiceItemModel } from './../../../modules/invoice/repository/invoice-items.model'
import express, { Express } from 'express'
import request from 'supertest'
import { Sequelize } from 'sequelize-typescript'
import InvoiceFacadeFactory from '../../../modules/invoice/factory/invoice.factory'
import { GenerateInvoiceFacadeInputDto } from '../../../modules/invoice/facade/invoice.facade.interface'
import { invoiceRoute } from '../routes/invoice.route'
import { InvoiceModel } from '../../../modules/invoice/repository/invoice.model'

describe('E2E test for invoice', () => {
  const app: Express = express()
  app.use(express.json())
  app.use('/invoice', invoiceRoute)

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([InvoiceItemModel, InvoiceModel])
    await sequelize.sync()
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should find a invoice', async () => {
    const invoiceFacade = InvoiceFacadeFactory.create()

    const invoiceInput: GenerateInvoiceFacadeInputDto = {
      name: 'André M Fagundes',
      document: '92954658745',
      street: 'Rua João José',
      number: '435',
      complement: 'Casa Amarela',
      city: 'João Pinheiro',
      state: 'MG',
      zipCode: '38770000',
      items: [
        {
          id: '1',
          name: 'Invoice Item name',
          price: 15,
        },
      ],
    }
    const generatedInvoice = await invoiceFacade.generate(invoiceInput)

    const response = await request(app)
      .get(`/invoice/${generatedInvoice.id}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBe('André M Fagundes')
    expect(response.body.document).toBe('92954658745')
    expect(response.body.address.street).toBe('Rua João José')
    expect(response.body.address.complement).toBe('Casa Amarela')
    expect(response.body.address.city).toBe('João Pinheiro')
    expect(response.body.address.state).toBe('MG')
    expect(response.body.address.zipCode).toBe('38770000')
    expect(response.body.items[0].id).toBe('1')
    expect(response.body.items[0].name).toBe('Invoice Item name')
    expect(response.body.items[0].price).toBe(15)
    expect(response.body.total).toBe(15)
  })
})
