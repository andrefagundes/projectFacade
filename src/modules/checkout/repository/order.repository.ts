import { OrderModel } from './order.model'
import { ClientModel } from '../../client-adm/repository/client.model'
import { CatalogProductModel } from '../../store-catalog/repository/product.model'
import Order from '../domain/order.entity'
import CheckoutGateway from '../gateway/checkout.gateway'

export default class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    const products = order.products.map((p) => ({
      id: p.id.id,
      name: p.name,
      description: p.description,
      salesPrice: p.salesPrice,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }))
    await OrderModel.create({
      id: order.id.id,
      client_id: order.client.id.id,
      products,
      status: order.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
  findOrder(id: string): Promise<Order> {
    throw new Error('Method not implemented.')
  }
}
