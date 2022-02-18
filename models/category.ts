import { 
  Association, 
  BelongsToCreateAssociationMixin, 
  BelongsToGetAssociationMixin, 
  CreationOptional, 
  DataTypes, 
  HasManyGetAssociationsMixin, 
  InferAttributes, 
  InferCreationAttributes, 
  Model, 
  NonAttribute 
} from 'sequelize';

import { User, Product } from './index';
import db from '../database/connection';

class Category extends Model<InferAttributes<Category, {omit: 'products'}>, InferCreationAttributes<Category, {omit: 'products'}>> {
  declare id        : CreationOptional<number>;
  declare name      : string;
  declare lower     : CreationOptional<string>;
  declare ownerId   : number;
  // declare state     : CreationOptional<boolean>;

  declare getProducts: HasManyGetAssociationsMixin<Product>;

  declare getUser: BelongsToGetAssociationMixin<User>;
  declare createUser: BelongsToCreateAssociationMixin<User>;

  declare products ?: NonAttribute<Category[]>;

  declare static associations: {
    user: Association<Category, User>;
    products: Association<Category, Product>;
  }
}

Category.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: new DataTypes.STRING(50), allowNull: false },
    lower: new DataTypes.STRING(50),
    ownerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    // state: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    defaultScope: {},
    scopes: {
      withUser: {
        include: { model: User, as: 'user', attributes: ['name'] }
      },
      deleted: {
        where: db.where(db.col('deletedAt'), "!=", null),
        paranoid: false
      }
    },
    tableName: 'categories',
    timestamps: true,
    paranoid: true,
    sequelize: db,
  }
);

Category.beforeSave(category => {
  if(!category.name) return;

  const trim = category.name.split(' ').filter(i => i).join(' ');

  category.name  = trim.charAt(0).toUpperCase() + trim.substring(1).toLowerCase();
  // this.lower = this.name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""); --> Quitar acentos

  category.lower = category.name.toLowerCase();
});

export default Category;