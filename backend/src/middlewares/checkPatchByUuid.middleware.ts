import { NextFunction, Request, Response } from 'express';
import checkRequiredFields from '../utils/checkRequiredFields';

async function checkPatchByUuidFields(req: Request, res:Response, next: NextFunction) {
    const { body } = req;
    const requiredFields = [
        'measureUuid', 'confirmedValue',
    ];
    const checkFieldsError = checkRequiredFields(body, requiredFields);
    if (checkFieldsError) return res.status(400).json({ message: checkFieldsError });

    next();
}

async function checkPatchByUuid(req: Request, res: Response, next: NextFunction) {
    const { measureUuid, confirmedValue } = req.body;

    if (typeof measureUuid !== 'string') {
        return res.status(400).json({ message: 'measureUuid tem que ser uma string.' });
    }

    if (typeof confirmedValue !== 'number') {
        return res.status(400).json({ message: 'confirmedValue tem que ser um número.' });
    }

    next();
}

export default {
    checkPatchByUuid,
    checkPatchByUuidFields
}