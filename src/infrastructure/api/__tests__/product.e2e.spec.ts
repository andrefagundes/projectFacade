import express, { Express } from 'express'
import request from 'supertest'
import { Sequelize } from 'sequelize-typescript'
import { productAdmRoute } from '../routes/product-adm.route'
import { ProductModel } from '../../../modules/product-adm/repository/product.model'

describe('E2E test for product', () => {
  const app: Express = express()
  app.use(express.json())
  app.use('/product', productAdmRoute)

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([ProductModel])
    await sequelize.sync()
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should create a product', async () => {
    const response = await request(app).post('/product').send({
        id: '1',
      name: 'Tênis Nike',
      description: 'Product A Description',
      purchasePrice: 399,
      stock: 10,
    })

    expect(response.status).toBe(201)
    expect(response.text).toBe('Product add with success')
  })
})
