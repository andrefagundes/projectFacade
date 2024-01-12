import UseCaseInterface from '../../../@shared/usecase/use-case.interface'
import InvoiceGateway from '../../gateway/invoice.gateway'
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from './find-invoice.dto'

export default class FindInvoiceUseCase implements UseCaseInterface {
  constructor(private invoiceRepository: InvoiceGateway) {}

  async execute(
    input: FindInvoiceUseCaseInputDTO,
  ): Promise<FindInvoiceUseCaseOutputDTO> {
    const result = await this.invoiceRepository.find(input.id)

    const total = result.calcularTotal()

    const items = result.items.map((item) => {
      return {
        id: item.id.id,
        name: item.name,
        price: item.price,
      }
    })

    return {
      id: result.id.id,
      name: result.name,
      document: result.document,
      address: {
        street: result.address.street,
        number: result.address.number,
        city: result.address.city,
        state: result.address.state,
        zipCode: result.address.zipCode,
        complement: result.address.complement,
      },
      items: items,
      total: total,
      createdAt: result.createdAt,
    }
  }
}
