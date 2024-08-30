import { Router } from 'express';
import checkReaderFieldsMiddleware from '../middlewares/checkReaderFields.middleware';
import checkCustomerMeasurementMiddleware from '../middlewares/checkCustomerMeasurement.middleware';
import checkPatchByUuidMiddleware from '../middlewares/checkPatchByUuid.middleware';
import MeasurementController from '../controllers/MeasurementController';

const measurementController = new MeasurementController();

const measurementRouter = Router();

measurementRouter.post(
    '/upload',
    checkReaderFieldsMiddleware.checkPostFields,
    checkReaderFieldsMiddleware.checkInputtableFields,
    (req, res) => measurementController.upload(req, res),
);

measurementRouter.patch(
    '/confirm',
    checkPatchByUuidMiddleware.checkPatchByUuidFields,
    checkPatchByUuidMiddleware.checkPatchByUuid,
    (req, res) => measurementController.patchByUuid(req, res),
)

measurementRouter.get(
    '/:customerCode/list',
    checkCustomerMeasurementMiddleware.checkCustomerMeasurementFields,
    (req, res) => measurementController.getMeasurementsByCustomer(req, res)
);

measurementRouter.get(
    '/upload',
    (req, res) => measurementController.getAllMeasurements(req, res),
);

export default measurementRouter;