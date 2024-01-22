import {
  BelongsTo,
  Column,
  ForeignKey,
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

  @Column({ allowNull: false })
  declare name: string

  @Column({ allowNull: false })
  declare price: number

  @BelongsTo(() => InvoiceModel, { foreignKey: 'invoice_id' })
  declare invoice: InvoiceModel[]

  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false })
  declare invoice_id: string

  @Column({ allowNull: false })
  declare createdAt: Date

  @Column({ allowNull: false })
  declare updatedAt: Date
}
