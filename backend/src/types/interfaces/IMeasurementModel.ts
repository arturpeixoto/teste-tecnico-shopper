import { ICRUDModelCreator, ICRUDModelReader } from './ICRUDModel';
import { IMeasurement } from './IMeasurement';

export interface IMeasurementModel extends ICRUDModelReader<IMeasurement>,
ICRUDModelCreator<IMeasurement | null> {
  checkDatetime(costumerCode: IMeasurement['customerCode'], measureType: IMeasurement['measureType'], measureDatetime: IMeasurement['measureDatetime']): Promise<boolean>,
  patchByUuid(measureUuid: IMeasurement['measureUuid'], confirmedValue: number): Promise<IMeasurement | null | 'REALIZADA'>
  findByCustomerCode(costumerCode: IMeasurement['customerCode'], measureType?: IMeasurement['measureType'] | undefined): Promise<IMeasurement[]>
}