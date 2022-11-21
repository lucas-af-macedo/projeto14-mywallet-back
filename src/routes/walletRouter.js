
import express from 'express';
import {postTransation, getTransations, deleteTransation, putTransation} from '../controllers/walletController.js'
import {transationValidation, transationPutValidation} from '../Middlewares/walletValidationMiddlewares.js'

const walletRouter = express.Router();
walletRouter.post ('/transation', transationValidation, postTransation);
walletRouter.get ('/transations', getTransations);
walletRouter.delete ('/transation/:id', deleteTransation);
walletRouter.put('/transation/:id', transationPutValidation, putTransation);
export default walletRouter;