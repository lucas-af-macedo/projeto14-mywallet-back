import express from 'express';
import cors from 'cors';
//import dotenv from 'dotenv';
import joi from 'joi';
import dayjs from 'dayjs';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db('myWallet');
});

const signUpSchema = joi.object({
    email: joi.string().required(),
    name: joi.string().required(),
    password: joi.string().required()
})

const signInSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
})

app.post ('/sign-up', async (req, res) => {
    const validation = signUpSchema.validate(req.body,{abortEarly: false})
    const user = req.body;

    if(validation.error){
        const errors = validation.error.details.map((detail)=>detail.message)
        res.status(422).send(errors)
        return;
    }

    try{
        const passwordHash = bcrypt.hashSync(user.password, 10);

        await db.collection('users').insertOne({...user, password: passwordHash})

    } catch(err){
        res.sendStatus(500)
    }
    res.sendStatus(201)
})


app.listen(5000);

