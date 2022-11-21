import {signInSchema,signUpSchema} from '../schemas/authSchema.js'

export async function signUpValidation(req, res, next){
    const validation = signUpSchema.validate(req.body,{abortEarly: false}) 

    if(validation.error){
        const errors = validation.error.details.map((detail)=>detail.message)
        res.status(422).send(errors)
        return;
    }
    next();
}


export async function signInValidation(req, res, next){
    const validation = signInSchema.validate(req.body,{abortEarly: false})

    if(validation.error){
        const errors = validation.error.details.map((detail)=>detail.message)
        res.status(422).send(errors)
        return;
    }
    next();

}
