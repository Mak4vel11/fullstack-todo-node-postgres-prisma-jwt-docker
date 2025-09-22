import express from 'express'
import db from '../db.js'
import prisma from './prismaClient.js'

const router = express.Router()

//get all to do from logged-in user 
router.get('/', async (req, res) => {
    //GET ALL TODOS ASSOCIATE WITH USER 
    //PREPARE SQL QUREY 
    const todos = await prisma.todo.findMany({
        where: {
        userId: req.userId
        }
    })
    res.json(todos)
})

//create new to do 
//we are going to send 
router.post('/', async (req,res) => {
    const {task} = req.body
    const todo = await prisma.todo.create({
        data: {
            task,
            userId: req.userId
        }
    })

    res.json(todo)
})

//update a todo 
//we are going to do a put 
//to match id we are going to use a dynamic qurey parameter 
//ACCES COMPLETET SATTUS FROM REQ BODU 
router.put('/:id', async (req, res ) => {
    const {completed} = req.body
    const {id} = req.params
    const updatedTodo = prisma.todo.update({
            //we update todo when id matches and when we have
            //the correct user 
        where: {
            id: parseInt(id),
            userId: req.userId
        },
        //provide the new data witch is going to be the new completed field 
        data:{
            //!! that is going to convert into a boolean amount 
            completed: !!completed
        }
    })


res.json(updatedTodo)
})

//delete a todo
router.delete('/:id', async (req, res ) => {
    //req.param sepse eshe parameter 
    const  {id} = req.params
    const userId = req.userId
    //we want to delete nly on to od that is associate with that user 
    await prisma.todo.delete({
        where:{
            id: parseInt(id),
            userId: req.userId
        }
    })

    res.send({message: "Todo deleted"})
})

export default router