import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveredOrderController from './app/controllers/DeliveredOrderController';
import DeliveryStartController from './app/controllers/DeliveryStartController';
import DeliveryEndController from './app/controllers/DeliveryEndController';
import ProblemController from './app/controllers/ProblemController';
import AllProblemsController from './app/controllers/AllProblemsController';
import CancellationController from './app/controllers/CancellationController';
import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:id/deliveries', DeliveryController.index); // prox entregas
routes.get('/deliveryman/:id/delivered', DeliveredOrderController.index); // entregues

routes.put('/deliveryman/:id/start', DeliveryStartController.update); // Retirada de produto
routes.put('/deliveryman/:id/end', DeliveryEndController.update); // Finalizar Entrega

routes.post('/delivery/:id/problems', ProblemController.store); //
routes.get('/delivery/:id/problems', ProblemController.index); //

routes.get('/notifications/:id/', NotificationController.index);
routes.put('/notifications/:id/', NotificationController.update);

routes.use(authMiddleware);

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.get('/delivery/problems', AllProblemsController.index);

routes.delete('/problem/:id/cancel-delivery', CancellationController.delete); //

export default routes;
