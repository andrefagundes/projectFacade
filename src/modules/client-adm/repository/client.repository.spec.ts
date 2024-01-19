import { Sequelize } from 'sequelize-typescript'
import Address from '../../@shared/domain/value-object/address'
import Id from '../../@shared/domain/value-object/id.value-object'
import Client from '../domain/client.entity'
import { ClientModel } from './client.model'
import ClientRepository from './client.repository'

describe('Client Repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([ClientModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a client', async () => {
    const client = new Client({
      id: new Id('1'),
      name: 'Andre',
      email: 'amfcom@gmail.com',
      document: '92930654124',
      address: new Address({
        street: 'Rua João José',
        number: '425',
        complement: 'Casa Amarela',
        city: 'João Pinheiro',
        state: 'MG',
        zipCode: '38770000',
      }),
    })

    const repository = new ClientRepository()
    await repository.add(client)

    const clientDb = await ClientModel.findOne({ where: { id: '1' } })

    expect(clientDb).toBeDefined()
    expect(clientDb.id).toEqual(client.id.id)
    expect(clientDb.name).toEqual(client.name)
    expect(clientDb.email).toEqual(client.email)
    expect(clientDb.document).toEqual(client.document)
    expect(clientDb.street).toEqual(client.address.street)
    expect(clientDb.number).toEqual(client.address.number)
    expect(clientDb.complement).toEqual(client.address.complement)
    expect(clientDb.city).toEqual(client.address.city)
    expect(clientDb.state).toEqual(client.address.state)
    expect(clientDb.zipcode).toEqual(client.address.zipCode)
    expect(clientDb.createdAt).toStrictEqual(client.createdAt)
    expect(clientDb.updatedAt).toStrictEqual(client.updatedAt)
  })

  it('should find a client', async () => {
    const client = await ClientModel.create({
      id: '1',
      name: 'Andre',
      email: 'amfcom@gmail.com',
      document: '92930654124',
      street: 'Rua João José',
      number: '425',
      complement: 'Casa Amarela',
      city: 'João Pinheiro',
      state: 'MG',
      zipcode: '38770000',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const repository = new ClientRepository()
    const result = await repository.find(client.id)

    expect(result.id.id).toEqual(client.id)
    expect(result.name).toEqual(client.name)
    expect(result.email).toEqual(client.email)
    expect(result.address.street).toEqual(client.street)
    expect(result.address.number).toEqual(client.number)
    expect(result.address.complement).toEqual(client.complement)
    expect(result.address.city).toEqual(client.city)
    expect(result.address.state).toEqual(client.state)
    expect(result.address.zipCode).toEqual(client.zipcode)
    expect(result.createdAt).toStrictEqual(client.createdAt)
    expect(result.updatedAt).toStrictEqual(client.updatedAt)
  })
})
