import { Sequelize } from 'sequelize-typescript'
import Id from '../../@shared/domain/value-object/id.value-object'
import { ClientModel } from '../../client-adm/repository/client.model'
import { CatalogProductModel } from '../../store-catalog/repository/product.model'
import Client from '../domain/client.entity'
import Order from '../domain/order.entity'
import Product from '../domain/product.entity'
import { OrderModel } from './order.model'
import OrderRepository from './order.repository'

describe('OrderRepository test', () => {
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

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create an order', async () => {
    const order = new Order({
      id: new Id('1'),
      client: new Client({
        id: new Id('1'),
        name: 'André Maciel Fagundes',
        email: 'amfcom@gmail.com',
        document: '92925410254',
        street: 'Rua João José',
        number: '425',
        complement: 'Casa Amarela',
        city: 'João Pinheiro',
        state: 'Minas Gerais',
        zipCode: '38770000',
      }),
      products: [
        new Product({
          id: new Id('1'),
          name: 'Tênis Nike',
          description: 'Tênis lançamento Nike',
          salesPrice: 199,
        }),
      ],
      status: 'approved',
    })

    const repository = new OrderRepository()
    await repository.addOrder(order)

    const orderDb = await OrderModel.findOne({
      where: { id: '1' },
      include: [{ model: ClientModel }, { model: CatalogProductModel }],
    })

    expect(orderDb).toBeDefined()
    expect(orderDb.id).toBe(order.id.id)
    expect(orderDb.client.id).toEqual(order.client.id.id)
    expect(orderDb.client.name).toEqual(order.client.name)
    expect(orderDb.client.email).toEqual(order.client.email)
    expect(orderDb.client.document).toEqual(order.client.document)
    expect(orderDb.client.street).toEqual(order.client.street)
    expect(orderDb.client.number).toEqual(order.client.number)
    expect(orderDb.client.complement).toEqual(order.client.complement)
    expect(orderDb.client.city).toEqual(order.client.city)
    expect(orderDb.client.state).toEqual(order.client.state)
    expect(orderDb.client.zipcode).toEqual(order.client.zipCode)
    expect(orderDb.products[0].id).toEqual(order.products[0].id.id)
    expect(orderDb.products[0].name).toBe(order.products[0].name)
    expect(orderDb.products[0].description).toBe(order.products[0].description)
    expect(orderDb.products[0].salesPrice).toBe(order.products[0].salesPrice)
    expect(orderDb.status).toEqual(order.status)
  })
})
