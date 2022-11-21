import joi from "joi";

export const transationSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
    type: joi.string().required()
})

export const transationPutSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required()
})