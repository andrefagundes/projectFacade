import Address from "../../../@shared/domain/value-object/address"
import AddClientUseCase from "./add-client.usecase"

const MockRepository = () => {
  return {

    add: jest.fn(),
    find: jest.fn()
  }
}

describe("Add Client use case unit test", () => {

  it("should add a client", async () => {

    const repository = MockRepository()
    const usecase = new AddClientUseCase(repository)

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

    const result =  await usecase.execute(input)

    expect(repository.add).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.name).toEqual(input.name)
    expect(result.email).toEqual(input.email)
    expect(result.address).toEqual(input.address)

  })
})