import express, { Express } from 'express'
import request from 'supertest'
import { Sequelize } from 'sequelize-typescript'
import { OrderModel } from '../../../modules/checkout/repository/order.model'
import { ClientModel } from '../../../modules/client-adm/repository/client.model'
import { CatalogProductModel } from '../../../modules/store-catalog/repository/product.model'
import { clientAdmRoute } from '../routes/client-adm.route'

describe('E2E test for client', () => {
  const app: Express = express()
  app.use(express.json())
  app.use('/client', clientAdmRoute)

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([OrderModel, CatalogProductModel, ClientModel])
    await sequelize.sync()
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should create a client', async () => {
    const response = await request(app).post('/client').send({
      name: 'André M Fagundes',
      email: 'amfcom@gmail.com',
      document: '92954658745',
      street: 'Rua João José',
      number: '435',
      complement: 'Casa Amarela',
      city: 'João José',
      state: 'MG',
      zipCode: '38770000',
    })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({})
  })
})
