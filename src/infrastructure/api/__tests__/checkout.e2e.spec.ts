import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript'
import request from 'supertest'
import { Umzug } from 'umzug'
import Address from '../../../modules/@shared/domain/value-object/address'
import { OrderModel } from '../../../modules/checkout/repository/order.model'
import { ClientModel } from '../../../modules/client-adm/repository/client.model'
import { CatalogProductModel } from '../../../modules/store-catalog/repository/product.model'
import TransactionModel from '../../../modules/payment/repository/transaction.model'
import ClientRepository from '../../../modules/client-adm/repository/client.repository'
import AddClientUseCase from '../../../modules/client-adm/usecase/add-client/add-client.usecase'
import { InvoiceItemModel } from '../../../modules/invoice/repository/invoice-items.model'
import { InvoiceModel } from '../../../modules/invoice/repository/invoice.model'
import { ProductModel } from '../../../modules/product-adm/repository/product.model'
import ProductRepository from '../../../modules/product-adm/repository/product.repository'
import AddProductUseCase from '../../../modules/product-adm/usecase/add-product/add-product.usecase'
import { checkoutRoute } from '../routes/checkout.route'
import { migrator } from './config-migrations/migrator'

describe('E2E test for checkout', () => {
  const app: Express = express()
  app.use(express.json())
  app.use('/checkout', checkoutRoute)

  let sequelize: Sequelize
  let migration: Umzug<any>

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    })

    sequelize.addModels([
      InvoiceModel,
      InvoiceItemModel,
      OrderModel,
      CatalogProductModel,
      ClientModel,
      ProductModel,
      TransactionModel,
    ])
    migration = migrator(sequelize)
    await migration.up()
  })

  afterEach(async () => {
    try {
      await migration.down()
    } catch (error) {
      console.error('Error during migration.down():', error)
    } finally {
      await sequelize.close()
    }
  })

  it('should create an order', async () => {

    const repository = new ClientRepository()
    const addClientUsecase = new AddClientUseCase(repository)

    const input = {
      name: 'Andre',
      email: 'amfcom@gmail.com',
      document: '95846575254',
      address: new Address({
        street: 'Rua João José',
        number: '425',
        complement: 'Casa Amarela',
        city: 'João Pinheiro',
        state: 'MG',
        zipCode: '38770000',
      }),
    }

    const client = await addClientUsecase.execute(input)

    const productRepository = new ProductRepository()
    const addProductUseCase = new AddProductUseCase(productRepository)
    const product = await addProductUseCase.execute({
      name: 'Product 1',
      description: 'Product description',
      purchasePrice: 123,
      stock: 10,
    })

    CatalogProductModel.update(
      { salesPrice: product.purchasePrice },
      { where: { id: product.id } },
    )

    const response = await request(app)
      .post('/checkout')
      .send({
        client_id: client.id,
        products: [product].map((p) => ({ productId: p.id })),
      })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('approved')
    expect(response.body.total).toBe(123)
  })
})
