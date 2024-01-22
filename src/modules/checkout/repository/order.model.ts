import {
  Model,
  Table,
  Column,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript'
import { ClientModel } from '../../client-adm/repository/client.model'
import { CatalogProductModel } from '../../store-catalog/repository/product.model'

@Table({
  tableName: 'orders',
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string

  @Column({ allowNull: false })
  declare status: string

  @Column({ allowNull: false })
  declare createdAt: Date

  @Column({ allowNull: false })
  declare updatedAt: Date

  @ForeignKey(() => ClientModel)
  @Column({ allowNull: false, field: 'client_id' })
  declare client_id: string

  @BelongsTo(() => ClientModel, 'client_id')
  declare client: ClientModel

  @HasMany(() => CatalogProductModel)
  declare products: CatalogProductModel[]
}
