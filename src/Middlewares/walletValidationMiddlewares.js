import {transationSchema, transationPutSchema} from '../schemas/walletSchema.js'

export async function transationValidation(req, res, next){
    const validation = transationSchema.validate(req.body,{abortEarly: false})
    
    if(validation.error){
        const errors = validation.error.details.map((detail)=>detail.message)
        res.status(422).send(errors)
        return;
    }
    next();
}

export async function transationPutValidation(req, res, next){
    const validation = transationPutSchema.validate(req.body,{abortEarly: false})
    
    if(validation.error){
        const errors = validation.error.details.map((detail)=>detail.message)
        res.status(422).send(errors)
        return;
    }
    next();
}