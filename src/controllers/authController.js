import {db} from '../server.js'
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';


export async function signUp(req, res){
    const user = req.body;


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
}


export async function signIn(req, res){
const user = req.body;


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
}