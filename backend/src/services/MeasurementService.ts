import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { ReadBody, ReadResponse, ReadResponseAI } from '../types/Types';
import { ServiceResponse } from '../utils/ServiceResponse';
import { IMeasurementModel } from '../types/interfaces/IMeasurementModel';
import MeasurementModel from '../models/MeasurementModel';
import { ICustomerMeasurementResponse, IMeasurement, IMeasurementResponse } from '../types/interfaces/IMeasurement';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
const fileManager = new GoogleAIFileManager(process.env.API_KEY as string);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
let tempFilePath: string;

export default class MeasurementService {
    constructor(private measurementModel: IMeasurementModel = new MeasurementModel()) {}

    private decodeBase64Image(base64String: string): Buffer {
        const matches = base64String.match(/^data:(.+);base64,(.+)$/);
        if (!matches) {
            throw new Error('Invalid base64 string');
        }
        const base64Data = matches[2];
        return Buffer.from(base64Data, 'base64');
    }

    public async uploadAndAnalyzeImage({ customerCode, measureType, measureDatetime, image }: ReadBody): Promise<ServiceResponse<ReadResponse>> {
        try {
            const imageBuffer = this.decodeBase64Image(image);
            // Salve a imagem temporariamente para enviar ao Google AI
            tempFilePath = `temp-${uuidv4()}.jpg`;
            fs.writeFileSync(tempFilePath, imageBuffer);

            const prompt = `Analisar a imagem em base64 como uma leitura de consumo de ${measureType}. Extrair o valor numérico da leitura, incluindo a unidade (m³, litros, etc.). Retornar em formato JSON, sem comentários, da seguinte forma: {imageUrl: string, measureValue:integer, measureUnit: string}`;
            const uploadResponse = await fileManager.uploadFile(tempFilePath, {
                mimeType: 'image/jpeg', // Ajuste o tipo MIME se necessário
                displayName: 'Leitura de consumo',
            });
            const result = await model.generateContent([
                { fileData: { mimeType: uploadResponse.file.mimeType, fileUri: uploadResponse.file.uri } },
                { text: prompt },
            ]);
            const { response } = result;

            if (response && response.candidates && response.candidates.length > 0) {
                const { content } = response.candidates[0];
                if (content.parts && content.parts[0] && content.parts[0].text) {
                    const jsonResponse = content.parts[0].text.replace(/```json\n?|```/g, '') as string;
                    const { measureValue, measureUnit } = JSON.parse(jsonResponse) as ReadResponseAI;
                    const measureUuid = uuidv4();

                    console.log(`Caminho da Imagem: ${uploadResponse.file.uri}
                        Customer Code: ${customerCode}
                        Measure Datetime: ${measureDatetime}
                        Measure Type: ${measureType}
                        Measure Value: ${measureValue}
                        Measure Unit: ${measureUnit}
                        Measure UUID: ${measureUuid}
                    `);

                    return {
                        status: 'CREATED',
                        data: { imageUrl: uploadResponse.file.uri, measureValue, measureUuid },
                    };
                } 
                    console.error('content.parts[0].text is undefined');
                    return {
                        status: 'INTERNAL_SERVER_ERROR',
                        data: { message: 'Algo inesperado aconteceu.' },
                    };
            } 
                console.log('Nenhuma resposta válida foi retornada pelo modelo.');
                return {
                    status: 'INTERNAL_SERVER_ERROR',
                    data: { message: 'Algo inesperado aconteceu. Tente novamente.' },
                };
        } catch (error) {
            console.error('Erro ao processar a imagem: ', error);
            return {
                status: 'INTERNAL_SERVER_ERROR',
                data: { message: 'Erro ao processar a imagem.' },
            };
        } finally {
            fs.unlinkSync(tempFilePath);
        }
    }

    public async create(req: ReadBody): Promise<ServiceResponse<ReadResponse>> {
        const { customerCode, measureType, measureDatetime, image } = req;
        const alreadyMeasured = await this.measurementModel.checkDatetime(customerCode, measureType, measureDatetime);
        if (alreadyMeasured) {
            return { status: 'DOUBLE_REPORT', data: { message:  'Leitura do mês já realizada'} };

        }
        const { status, data } = await this.uploadAndAnalyzeImage({ customerCode, measureType, measureDatetime, image });
        if (status == 'CREATED') {
            const date = new Date(measureDatetime)
            const { imageUrl, measureValue, measureUuid } = await this.measurementModel.create({ measureDatetime: date, measureType, customerCode, ...data }) as IMeasurement;
            return { status, data: { imageUrl, measureValue, measureUuid } };
        }
        return { status, data } as ServiceResponse<ReadResponse>;
    }

    public async getAllMeasurements(): Promise<ServiceResponse<IMeasurementResponse[]>> {
        const allMeasurements = await this.measurementModel.findAll();
        return { status: 'SUCCESSFUL', data: allMeasurements };
    }

    public async patchByUuid(measureUuid: string, confirmedValue: number) {
        const patch = await this.measurementModel.patchByUuid(measureUuid, confirmedValue);
        if (patch == null) {
            return { status: 'NOT_FOUND', data: { message: 'Leitura não encontrada '} };
        }
        if (patch == 'REALIZADA') {
            return { status: 'CONFIRMATION_DUPLICATE', data: { message: 'Leitura do mês já realizada'} };
        }
        return { status: 'SUCCESSFUL', data: { message: 'Leitura confirmada' } };
    }

    public async getMeasurementsByCustomer(customerCode: string, measureType?: 'WATER' | 'GAS'): Promise<ServiceResponse<ICustomerMeasurementResponse>> {
        try {
            const measurements = await this.measurementModel.findByCustomerCode(customerCode, measureType);
            if (measurements.length === 0) {
                return {
                    status: 'NOT_FOUND',
                    data: { message: 'Nenhuma leitura encontrada' },
                };
            }
            return { 
                status: 'SUCCESSFUL', 
                data: { customerCode, measures: measurements } 
            };
        } catch (error) {
            console.error('Erro ao buscar medições:', error);
            return {
                status: 'INTERNAL_SERVER_ERROR',
                data: { message: 'Erro ao buscar medições.' },
            };
        }
    }
}