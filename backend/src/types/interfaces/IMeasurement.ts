import { Identifiable } from '.';

export interface IMeasurement extends Identifiable {
    measureDatetime: Date,
    measureValue: number,
    measureUuid: string,
    imageUrl: string,
    customerCode: string,
    measureType: 'WATER' | 'GAS',
    hasConfirmed: boolean,
}

export interface ICustomerMeasurement {
    measureUuid: string,
    measureDatetime: Date,
    measureType: string,
    hasConfirmed: boolean,
    imageUrl: string,
}

export interface ICustomerMeasurementResponse {
    customerCode: string;
    measures: ICustomerMeasurement[];
}


export type IMeasurementResponse = Omit<IMeasurement, 'id'>;