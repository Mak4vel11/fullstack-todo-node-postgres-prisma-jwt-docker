import express from 'express'
import db from '../db.js'

const router = express.Router()

//get all to do from logged-in user 
router.get('/', (req, res) => {
    //GET ALL TODOS ASSOCIATE WITH USER 
    //PREPARE SQL QUREY 
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?')
    const todos = getTodos.all(req.userId)
    res.json(todos)
})

//create new to do 
//we are going to send 
router.post('/', (req,res) => {
    const {task} = req.body
    const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?) `)
  const result =   insertTodo.run(req.userId, task)

    res.json({id: result.lastInsertRowid, task, completed: 0})
})

//update a todo 
//we are going to do a put 
//to match id we are going to use a dynamic qurey parameter 
router.put('/:id', (req, res ) => {
//ACCES COMPLETET SATTUS FROM REQ BODU 
const {completed} = req.body
const {id} = req.params
const {page } = req.query 

const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?')
updatedTodo.run(completed, id)

res.json({message: "Todo completed"})
})

//delete a todo
router.delete('/:id', (req, res ) => {
    //req.param sepse eshe parameter 
    const  {id} = req.params
    const userId = req.userId
    //we want to delete nly on to od that is associate with that user 
    const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    deleteTodo.run(id, userId)
    res.send({message: "Todo deleted"})
})

export default router