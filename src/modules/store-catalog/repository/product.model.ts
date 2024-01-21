import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { OrderModel } from '../../checkout/repository/order.model'

@Table({
  tableName: 'products',
  timestamps: false,
})
export class CatalogProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string

  @Column({ allowNull: false })
  declare name: string

  @Column({ allowNull: false })
  declare description: string

  @Column({ allowNull: false })
  declare salesPrice: number

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: true })
  declare order_id: string
}
