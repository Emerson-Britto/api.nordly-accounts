import instance from '../dataBases/mySql';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize';

class AccountModel extends Model<InferAttributes<AccountModel>, InferCreationAttributes<AccountModel>> {
  declare id: CreationOptional<Number>;
  declare displayName:String;
  declare mail:String;
  declare lastSeen:Number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AccountModel.init(
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  {
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
    }
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'accounts',
    sequelize: instance
  }
);

export default AccountModel;
