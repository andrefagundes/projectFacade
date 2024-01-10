import Address from '../../@shared/domain/value-object/address'
import Id from '../../@shared/domain/value-object/id.value-object'
import InvoiceItems from '../domain/invoice-item.entity'
import Invoice from '../domain/invoice.entity'
import InvoiceGateway from '../gateway/invoice.gateway'
import { InvoiceItemModel } from './invoice-items.model'
import { InvoiceModel } from './invoice.model'

export default class InvoiceRepository implements InvoiceGateway {
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id: id },
      include: ['items'],
    })

    if (!invoice) {
      throw new Error('Invoice not found!')
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address({
        street: invoice.street,
        number: invoice.number,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
        complement: invoice.complement,
      }),
      items: invoice.items.map((item) => {
        return new InvoiceItems({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })
      }),
    })
  }

  async generate(invoice: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        complement: invoice.address.complement,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        items: invoice.items.map((item) => {
          return {
            id: item.id.id,
            name: item.name,
            price: item.price,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }
        }),
      },
      {
        include: [{ model: InvoiceItemModel }],
      },
    )
  }
}
