import sequelize from '../dataBases/mySql';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize';

class AccountModel extends Model<InferAttributes<AccountModel>, InferCreationAttributes<AccountModel>> {
  declare id: CreationOptional<number>;
  declare displayName:string;
  declare mail:string;
  declare lastSeen:number;
  declare verified:number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AccountModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    displayName: {
      type: new DataTypes.STRING(20),
      allowNull: false
    },
    mail: {
      type: new DataTypes.STRING(40),
      allowNull: false
    },
    lastSeen: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    verified: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'accounts',
    sequelize
  }
);

export default AccountModel;
