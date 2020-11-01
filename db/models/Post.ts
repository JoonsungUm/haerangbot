import { Model, DataTypes, Sequelize } from 'sequelize'

export interface PostAttributes {
  id: number
  number: number
  startDate: Date | null
  endDate: Date | null
  title: string
  type: string
  publicationNumber: string | null
  noticeNumber: string | null
  createdAt: Date
  managerName: string | null
  managerPhone: string | null
  department: string | null
  content: string | null
}

export class Post extends Model<PostAttributes> implements PostAttributes {
  public id!: number
  public number!: number
  public startDate!: Date | null
  public endDate!: Date | null
  public title!: string
  public type!: string
  public publicationNumber!: string | null
  public noticeNumber!: string | null
  public createdAt!: Date
  public managerName!: string | null
  public managerPhone!: string | null
  public department!: string | null
  public content!: string | null
}

export function init(sequelize: Sequelize) {
  Post.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },

    number: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },

    startDate: { type: DataTypes.DATEONLY, field: 'start_date'},

    endDate: { type: DataTypes.DATEONLY, field: 'end_date'},

    title: { type: DataTypes.STRING(255), allowNull: false, defaultValue:'' },

    type: { type: DataTypes.STRING(50), allowNull: false, defaultValue:'' },

    publicationNumber: { type: DataTypes.STRING(50), field: 'publication_number' },

    noticeNumber: { type: DataTypes.STRING(50), field: 'notice_number' },

    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date(), field: 'created_at'},

    managerName: { type: DataTypes.STRING(20), field: 'manager_name' },

    managerPhone: { type: DataTypes.STRING(20), field: 'manager_phone' },

    department: { type: DataTypes.STRING(20) },

    content: { type: DataTypes.TEXT },
  }, {
    sequelize,
    timestamps: false,
    tableName: 'post',
  })
}
