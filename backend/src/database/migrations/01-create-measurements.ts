import { Model, QueryInterface, DataTypes } from 'sequelize'; 
import { Measurement } from '../../types/Types';

export default { 
  up(queryInterface: QueryInterface) { 
    return queryInterface.createTable<Model<Measurement>>('measurements', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      measureValue: {
        allowNull: false,
        type: DataTypes.FLOAT,
        field: 'measure_value',
      },
      measureUuid: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'measure_uuid',
      },
      imageUrl: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'image_url',
      },
      measureDatetime: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'measure_datetime',
      },
      customerCode: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'costumer_code',
      },
      measureType: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'measure_type',
      },
      hasConfirmed: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'has_confirmed',
        defaultValue: false,
      },
    }); 
  }, 
  
  down(queryInterface: QueryInterface) { 
    return queryInterface.dropTable('measurements'); 
  }, 
};
