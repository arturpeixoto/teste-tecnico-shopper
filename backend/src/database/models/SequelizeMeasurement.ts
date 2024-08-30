import {
    DataTypes,
    Model,
    InferCreationAttributes,
    InferAttributes,
    CreationOptional,
  } from 'sequelize';
  import db from '.';
  
  class SequelizeMeasurement extends Model<
    InferAttributes<SequelizeMeasurement>,
    InferCreationAttributes<SequelizeMeasurement>
  > {
    declare id: CreationOptional<number>;

    declare measureValue: number;

    declare measureUuid: string;

    declare imageUrl: string;

    declare measureDatetime: Date;

    declare customerCode: string;

    declare measureType: 'WATER' | 'GAS';

    declare hasConfirmed: boolean;
  }
  
  SequelizeMeasurement.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      measureValue: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'measure_value',
      },
      measureUuid: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'measure_uuid',
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'image_url',
      },
      measureDatetime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'measure_datetime',
      },
      customerCode: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'costumer_code',
      },
      measureType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'measure_type',
        validate: {
          isIn: {
              args: [['WATER', 'GAS']],
              msg: "O tipo de medida deve ser 'WATER' ou 'GAS'."
          }
      }
      },
      hasConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'has_confirmed',
      },
    },
    {
      sequelize: db,
      modelName: 'SequelizeMeasurements',
      tableName: 'measurements',
      timestamps: false,
      underscored: true,
    },
  );
  
  export default SequelizeMeasurement;
