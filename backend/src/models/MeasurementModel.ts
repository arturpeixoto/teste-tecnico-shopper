import { IMeasurement } from '../types/interfaces/IMeasurement';
import SequelizeMeasurement from '../database/models/SequelizeMeasurement';
import { IMeasurementModel } from '../types/interfaces/IMeasurementModel';
import { Op } from 'sequelize';

export default class MeasurementModel implements IMeasurementModel {
  private model = SequelizeMeasurement;

  async checkDatetime(
    customerCode: IMeasurement['customerCode'],
    measureType: IMeasurement['measureType'],
    measureDatetime: IMeasurement['measureDatetime']
  ): Promise<boolean> {
    try {
      const month = new Date(measureDatetime).getMonth()+1;
      const year = new Date (measureDatetime).getFullYear();
      const upload = await this.model.findAll({
        where: {
          customerCode,
          measureType,
          measureDatetime: {
            [Op.between]:  [new Date(year, month - 1, 1), new Date(year, month, 0)] ,
          },
        },
      });
      return upload.length > 0;
    } catch (error) {
      console.error('Erro ao verificar a medição:', error);
      return true;
    }
  }

  async create(data: IMeasurement): Promise<IMeasurement | null> {
    const dbData = await this.model.create({
      ...data,
      hasConfirmed: data.hasConfirmed ?? false,
    });
    const { measureDatetime, measureUuid, measureValue, id, imageUrl, customerCode: customerCode, measureType, hasConfirmed }: IMeasurement = dbData;
         return { measureDatetime, measureUuid, measureValue, id, imageUrl, customerCode: customerCode, measureType, hasConfirmed };
  }

  async findAll(): Promise<IMeasurement[]> {
    const uploads = await this.model.findAll({
      order: [['measureDatetime', 'DESC']],
    });

    return uploads.map((upload) => {
      const { measureDatetime, measureUuid, measureValue, id, imageUrl, customerCode: customerCode, measureType, hasConfirmed } = upload;
      return { measureDatetime, measureUuid, measureValue, id, imageUrl, customerCode, measureType, hasConfirmed };
    });
  }

  async findById(id: number): Promise<IMeasurement | null> {
    const measurement = await this.model.findByPk(id);

    if (!measurement) return null;

    const { measureDatetime, measureUuid, measureValue, imageUrl, customerCode: costumerCode, measureType, hasConfirmed } = measurement;

    return { measureDatetime, measureUuid, measureValue, id, imageUrl, customerCode: costumerCode, measureType, hasConfirmed };
  }

  async patchByUuid(measureUuid: IMeasurement['measureUuid'], confirmedValue: number): Promise<IMeasurement | null | 'REALIZADA'> {
    const measurement = await this.model.findOne({ where: { measureUuid } });
    if (!measurement) return null;
    if (measurement.hasConfirmed == true) return 'REALIZADA';
    measurement.measureValue = confirmedValue;
    measurement.hasConfirmed = true;
    await measurement.save();
    const { measureDatetime, measureValue, imageUrl, customerCode: costumerCode, measureType, hasConfirmed, id } = measurement;
    return { measureDatetime, measureUuid, measureValue, id, imageUrl, customerCode: costumerCode, measureType, hasConfirmed };
  }

  async findByCustomerCode(
    costumerCode: IMeasurement['customerCode'], 
    measureType?: IMeasurement['measureType']
  ): Promise<IMeasurement[]> {
    let measurements = await this.model.findAll({
      where: { customerCode: costumerCode },
      order: [['measureDatetime', 'DESC']],
    });
    if (measureType) {
      measurements = measurements.filter(measurement => measurement.measureType === measureType);
    }    

    return measurements;
}
}
