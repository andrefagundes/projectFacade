import { Sequelize } from 'sequelize-typescript'
import Id from '../../@shared/domain/value-object/id.value-object'
import { OrderModel } from './order.model'
import Order from '../domain/order.entity'
import { ClientModel } from '../../client-adm/repository/client.model'
import Client from '../domain/client.entity'
import { CatalogProductModel } from '../../store-catalog/repository/product.model'
import Product from '../domain/product.entity'
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
    const client = new Client({
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
    })

    const products = [
      new Product({
        id: new Id('1'),
        name: 'Tênis Nike',
        description: 'Tênis lançamento Nike',
        salesPrice: 199,
      }),
    ]

    const repository = new OrderRepository()
    const addOrderMock = jest.spyOn(repository, 'addOrder')

    const order = new Order({
      id: new Id('1'),
      client,
      products,
      status: 'approved',
    })

    addOrderMock.mockResolvedValue()

    await repository.addOrder(order)

    expect(addOrderMock).toHaveBeenCalled()
    expect(addOrderMock).toHaveBeenCalledWith(order)
    expect(addOrderMock.mock.calls.length).toBe(1)

    addOrderMock.mockRestore()
  })
})
