import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import MeasurementService from '../services/MeasurementService';

export default class MeasurementController {
  constructor(private measurementService = new MeasurementService()) {}
  
  public async upload(req: Request, res: Response) {
      const { customerCode, measureDatetime, measureType, image } = req.body;
      const measureTypeUpper = measureType.toString().toUpperCase()
      const { status, data } = await this.measurementService.create({ customerCode, measureDatetime, measureType: measureTypeUpper, image });
      res.status(mapStatusHTTP(status)).json(data);
  }

  public async getAllMeasurements(req: Request, res: Response) {
    const { status, data } = await this.measurementService.getAllMeasurements();
    res.status(mapStatusHTTP(status)).json(data);
  }

  public async patchByUuid(req: Request, res: Response) {
    const { measureUuid, confirmedValue } = req.body;
    const { status, data } = await this.measurementService.patchByUuid( measureUuid, confirmedValue );
    res.status(mapStatusHTTP(status)).json(data);
  }

  public async getMeasurementsByCustomer(req: Request, res: Response) {
    const { customerCode } = req.params;
    const { measureType } = req.query;
    if (measureType) {
        if (measureType !== 'WATER' && measureType !== 'GAS') {
            return res.status(400).json({ message: 'measureType só aceita valores de "WATER" ou "GAS"' });
        }
        const { status, data } = await this.measurementService.getMeasurementsByCustomer(customerCode, measureType);
        return res.status(mapStatusHTTP(status)).json(data);
    }
    const { status, data } = await this.measurementService.getMeasurementsByCustomer(customerCode);
    return res.status(mapStatusHTTP(status)).json(data);
}
}