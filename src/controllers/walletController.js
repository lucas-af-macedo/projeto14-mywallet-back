import { ObjectId } from 'mongodb';
import {db} from '../server.js'

export async function postTransation(req, res){
    const data = req.body;
    const token = req.headers.authorization.replace('Bearer ','')


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
}

export async function getTransations(req, res){
    const token = req.headers.authorization.replace('Bearer ','')

    try{
        const userExisist = await db.collection('sessions').findOne({token: token})
        
        if (userExisist){
            const transations = await db
                .collection('transation')
                .find({userId: userExisist.userId}).toArray()
            transations.forEach((item)=>delete item.userId)
            res.send(transations.reverse())
        }else{
            res.status(401).send({message:'Token inválido!'})
        }

    } catch(err){
        res.sendStatus(500)
    }
}

export async function deleteTransation(req, res){
    const id = req.params.id
    const token = req.headers.authorization.replace('Bearer ','')
    
    
    try{
        const userExisist = await db.collection('sessions').findOne({token: token})

        if (!userExisist){
            res.status(401).send({message:'Token inválido!'});
            return;
        }

        const message = await db.collection('transation').findOne({_id: ObjectId(id)})

        if (message){
            await db.collection('transation').deleteOne({_id: ObjectId(id)})
            res.status(200).send({ message: "Transacao apagada com sucesso!" });
        }else{
            res.sendStatus(404)
        }

    } catch (err){
        console.log(err)
        res.sendStatus(500)
    }

}

export async function putTransation(req, res){
    const token = req.headers.authorization.replace('Bearer ','')
    const {id} = req.params
    const body = req.body


    try{
        const userExisist = await db.collection('sessions').findOne({token: token})

        if (!userExisist){
            res.status(401).send({message:'Token inválido!'});
            return;
        }
        const transation = await db.collection('transation').findOne({_id: ObjectId(id)})

        if (transation){
            await db.collection('transation').updateOne({
                _id: transation._id
            },{
                $set: body
            })
        }else{
            res.sendStatus(404)
        }

    } catch (err){
        console.log(err)
        res.sendStatus(500)
    }

    res.sendStatus(201)
}