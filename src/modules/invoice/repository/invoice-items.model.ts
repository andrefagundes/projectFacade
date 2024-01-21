import {
  BelongsTo,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { InvoiceModel } from './invoice.model'

@Table({
  tableName: 'invoiceItems',
  timestamps: false,
})
export class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column
  declare id: string

  @BelongsTo(() => InvoiceModel, { foreignKey: 'invoice_id' })
  declare Invoice: InvoiceModel[]

  @Column({ allowNull: false })
  declare name: string

  @Column({ allowNull: false })
  declare price: number

  @Column({ allowNull: false })
  declare createdAt: Date

  @Column({ allowNull: false })
  declare updatedAt: Date
}
