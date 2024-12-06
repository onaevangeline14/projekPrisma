import { Category } from "@prisma/client";
import { NextFunction,Request, Response } from "express";
import { request } from "http";
import Joi  from 'joi'

//create schema when add new menu's data, all of fileds have to be requires
const addDataSchema = Joi.object({
    name : Joi.string().required(),
    price : Joi.number().min (0).required(),
    category: Joi.string ().required(),
    description: Joi.string().required(),
    picture: Joi.allow().optional()
})
  
export const verifyAddMenu = (request: Request, response:Response, next : NextFunction) => {
    //validate a request body and grab error if exist
    const { error } = addDataSchema.validate(request.body, { abortEarly: false})

    if (error) {
        //if there is an error , then give a response like this
        return response.status(400).json ({
            status: false,
            message: error.details.map (it => it.message).join()
        })
    } 
    return next()
}