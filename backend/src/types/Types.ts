export type ReadBody = {
    image: string;
    customerCode: string;
    measureDatetime: Date;
    measureType: 'WATER' | 'GAS';
}

export type ReadResponseAI = {
    imageUrl: string,
    measureValue: number,
    measureUnit: string,
}

export type ReadResponse = {
    imageUrl: string,
    measureValue: number,
    measureUuid: string,
}

export type Measurement = {
    id: number,
    customerCode: string,
    measureDatetime: Date,
    measureValue: number,
    measureUuid: string,
    imageUrl: string,
    measureType: string,
    hasConfirmed: boolean,
}

export type MeasurementWithOptionalId = {
    id?: number,
    costumerCode: string,
    measureDatetime: Date,
    measureValue: number,
    measureUuid: string,
    imageUrl: string,
}