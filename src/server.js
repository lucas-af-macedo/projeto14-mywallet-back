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
    email: joi.string().email().required(),
    name: joi.string().required(),
    password: joi.string().required()
})

const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})

const transationSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
    type: joi.string().required()
})

const transationPutSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
    type: joi.string().required(),
    date: joi.number().required()
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

        const userExisist = await db
            .collection('users')
            .findOne({...user, password: passwordHash})
        if(!userExisist)
            await db.collection('users').insertOne({...user, password: passwordHash})
        else{
            res.status(409).send({message: 'Usuário já cadastrado!'})
        }

    } catch(err){
        res.sendStatus(500)
    }
    res.sendStatus(201)
})

app.post ('/sign-in', async (req, res) => {
    const validation = signInSchema.validate(req.body,{abortEarly: false})
    const user = req.body;
    console.log(user)
    if(validation.error){
        const errors = validation.error.details.map((detail)=>detail.message)
        res.status(422).send(errors)
        return;
    }

    try{

        const userExisist = await db.collection('users').findOne({email: user.email})

        if (userExisist && bcrypt.compareSync(user.password, userExisist.password)){
            const token = uuid()

            await db.collection('sessions').insertOne({
                userId: userExisist._id,
                token
            })
            const body = {
                token: token,
                name: userExisist.name
            } 
            res.send(body)
        }else{
            res.status(401).send({message:'Usuário e/ou senha inválidos!'})
            return;
        }

    } catch(err){
        res.sendStatus(500)
    }
})

app.post ('/transation', async (req, res) => {
    const validation = transationSchema.validate(req.body,{abortEarly: false})
    const data = req.body;
    const token = req.headers.authorization.replace('Bearer ','')

    if(validation.error){
        const errors = validation.error.details.map((detail)=>detail.message)
        res.status(422).send(errors)
        return;
    }

    try{

        const userExisist = await db.collection('sessions').findOne({token: token})
        
        if (userExisist){
            await db.collection('transation').insertOne({
                ...data,
                userId: userExisist.userId,
                date: Date.now()
            })
        }else{
            res.status(401).send({message:'Token inválido!'})
        }

    } catch(err){
        res.sendStatus(500)
    }
    res.sendStatus(201)
})


app.get ('/transations', async (req, res) => {
    const token = req.headers.authorization.replace('Bearer ','')

    try{
        const userExisist = await db.collection('sessions').findOne({token: token})
        
        if (userExisist){
            const transations = await db
                .collection('transation')
                .find({userId: userExisist.userId}).toArray()
            transations.forEach((item)=>delete item.userId)
            res.send(transations)
        }else{
            res.status(401).send({message:'Token inválido!'})
        }

    } catch(err){
        res.sendStatus(500)
    }
})

app.delete ('/transations/:id', async (req, res) => {
    const id = req.params.id
    const user = req.headers.user

    try{
        const message = await db.collection('transation').findOne({_id: ObjectId(id)})

        if (message){
            if(user===message.from){
                await db.collection('transation').deleteOne({_id: ObjectId(id)})
                res.status(200).send({ message: "Transacao apagada com sucesso!" });
            }else{
                res.sendStatus(401)
            }
        }else{
            res.sendStatus(404)
        }

    } catch (err){
        console.log(err)
        res.sendStatus(500)
    }

})

app.listen(5000);

