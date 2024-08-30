import { NextFunction, Request, Response } from 'express';
import checkRequiredFields from '../utils/checkRequiredFields';

async function checkPostFields(req: Request, res:Response, next: NextFunction) {
    const { body } = req;
    const requiredFields = [
        'image', 'customerCode', 'measureDatetime', 'measureType',
    ];
    const checkFieldsError = checkRequiredFields(body, requiredFields);
    if (checkFieldsError) return res.status(400).json({ message: checkFieldsError });

    next();
}

const checkInputtableFields = (req: Request, res: Response, next: NextFunction) => {
    const { image, customerCode, measureDatetime, measureType } = req.body;
    const isBase64 = (str: string) => /^data:image\/[a-zA-Z]+;base64,.+$/i.test(str);

    if (!isBase64(image)) {
        return res.status(400).json({ message: 'Imagem tem que estar em base64.' });
    }
    if (typeof customerCode !== 'string') {
        return res.status(400).json({ message: 'costumerCode tem que ser uma string.' });
    }
    const isValidMeasureDatetime = (datetime: string): boolean => {
        const date = new Date(datetime);
        return !isNaN(date.getTime());
    };
    if (!isValidMeasureDatetime(measureDatetime)) {
        return res.status(400).json({ message: 'measureDatetime deve ser uma data válida.' });
    }
    const validMeasureTypes = ['WATER', 'GAS'];
    if (!validMeasureTypes.includes(measureType.toUpperCase())) {
        return res.status(400).json({ message: 'measureType só aceita valores de "WATER" or "GAS"' });
    }
    next();
};

export default {
    checkPostFields,
    checkInputtableFields,
  };