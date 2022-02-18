import { 
  Association, 
  CreationOptional, 
  DataTypes, 
  HasManyGetAssociationsMixin,
  InferAttributes, 
  InferCreationAttributes, 
  Model, 
  NonAttribute, 
} from 'sequelize';

import { Category } from './index';
import db from '../database/connection';

class User extends Model<InferAttributes<User, {omit: 'categories'}>, InferCreationAttributes<User, {omit: 'categories'}>> {
  declare id        : CreationOptional<number>;
  declare name      : string;
  declare lower     : CreationOptional<string>;
  declare email     : string;
  declare password  : string;
  declare avatar    : CreationOptional<string>;
  declare online    : CreationOptional<boolean>;
  declare roleId    : number;
  declare google    : CreationOptional<boolean>;
  // declare state     : CreationOptional<boolean>

  declare getCategories: HasManyGetAssociationsMixin<Category>;
  
  declare categories ?: NonAttribute<Category[]>;

  declare static associations: {
    categories: Association<User, Category>;
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true,  },
    name: { type: new DataTypes.STRING(50), allowNull: false },
    lower: new DataTypes.STRING(50),
    email: { type: new DataTypes.STRING(100), allowNull: false, unique: true }, //Se puede poner el nombre del unique en vez del true
    password: { type: new DataTypes.STRING(255), allowNull: false },
    avatar: new DataTypes.STRING(255),
    online: { type: DataTypes.BOOLEAN, defaultValue: false },
    roleId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    google: { type: DataTypes.BOOLEAN, defaultValue: false },
    // state: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ["id","roleId"]
      }
    },
    scopes: { 
      deleted: {
        where: db.where(db.col('deletedAt'), "!=", null),
        paranoid: false
      }
    },
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    sequelize: db,
  }
);

//-Hook
User.beforeSave(user => {
  if(!user.name) return;

  const trim = user.name.split(' ').filter(i => i).join(' ');

  user.name  = trim.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
  user.lower = user.name.toLowerCase();
});

export default User;