import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript'
import { ClientModel } from '../../modules/client-adm/repository/client.model'
import { InvoiceItemModel } from '../../modules/invoice/repository/invoice-items.model'
import { InvoiceModel } from '../../modules/invoice/repository/invoice.model'
import TransactionModel from '../../modules/payment/repository/transaction.model'
import { ProductModel } from '../../modules/product-adm/repository/product.model'
import { CatalogProductModel } from '../../modules/store-catalog/repository/product.model'
import { checkoutRoute } from './routes/checkout.route'
import { clientAdmRoute } from './routes/client-adm.route'
import { invoiceRoute } from './routes/invoice.route'
import { productAdmRoute } from './routes/product-adm.route'

export const app: Express = express()
app.use(express.json())
app.use('/client', clientAdmRoute)
app.use('/product', productAdmRoute)
app.use('/checkout', checkoutRoute)
app.use('/invoice', invoiceRoute)
export let sequelize: Sequelize

async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  })
  sequelize.addModels([
    ProductModel,
    ClientModel,
    CatalogProductModel,
    TransactionModel,
    InvoiceModel,
    InvoiceItemModel,
  ])
  await sequelize.sync()
}
setupDb()
