import joi from "joi";

export const signUpSchema = joi.object({
    email: joi.string().email().required(),
    name: joi.string().required(),
    password: joi.string().required()
})

export const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})