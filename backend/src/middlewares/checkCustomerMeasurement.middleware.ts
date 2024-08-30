import { NextFunction, Request, Response } from 'express';

async function checkCustomerMeasurementFields(req: Request, res: Response, next: NextFunction) {
    const { measureType } = req.query;

    if (measureType) {
        const measureTypeUpperCase = measureType.toString().toUpperCase();
        if (measureTypeUpperCase !== 'WATER' && measureTypeUpperCase !== 'GAS') {
            return res.status(400).json({ message: 'measureType só aceita valores de "WATER" ou "GAS"' });
        }
        req.query.measureType = measureTypeUpperCase;
    }
    
    next();
}

export default {
    checkCustomerMeasurementFields
}