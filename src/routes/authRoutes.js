import express from 'express'
import bcrypt from 'bcryptjs'

//auth key for autentifiaciton
import jwt from 'jsonwebtoken'
//import database
import db from '../db.js'

//how to configure endpoint or routes when they are not defined 
//in original file 


const router = express.Router()

//register new user endpoind /auth/register 
router.post('/register', (req, res) => { 
    const {username, password} = req.body

    //encrpyt the password 
    const hashedPassword = bcrypt.hashSync(password, 8)
    console.log(hashedPassword)
    console.log(username)

    //save the new user and hashed password to the db
    //prepare method we run a sql qurey 
    // we can inject value sql qurey 
    try {
        //we prepare a sql qurety were to intert data into a table that exist
        //within the database then we specify the table and then we spicfy 
        // the exact colums to whitch we want to add info 
        //we spicfy the values and we leave them blanks 
        //we add a new user 
        const insertUser = db.prepare(`INSERT INTO users (username, password)
        VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        //give them a entry to get how the app works

        //now that we have a user i want to add their first todo for them
            //we assign a default to do and we create a special token 
      const defaultTodo = `Hello :) Add your first todo ` 
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task)
            VALUES (?, ?)`)
            insertTodo.run(result.lastInsertRowid, defaultTodo)

            //create a token 
            //token is importat cuz once we loggin they create todo they
            //are associate a special token or key with that network request
            //its like a apikey
            const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, 
                {expiresIn: '24h'})
            res.json({token})

    } catch(err) {
        console.error(err.message)
        res.sendStatus(503)
        //500-599 means that the server has broken down 
        //this is what will happen if we fails to save a user
        //to the database 
    } 
})

router.post('/login', (req, res ) => { 
 //we get their email , and we look up the password associated with
 //that email in the database 
 //but we get it ad see its encrypted which means that we cannot compare
 //it to the one the uer just user trying to login , so what we can compare
 //get the encrypted pw and compare it to the pw in the database  
 
 const {username, password} = req.body

 try {//sequal comment to read user database 
    const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
    //inject username and read everything from the user where the username match
    const user = getUser.get(username)

    //if they dont have an acc and they want to login 
    if(!user) {return res.status(404).send({ message: "USER NOT FOUND"})}
//hash pw and compered to hash pw 
//will return a boolean 
//then pas dont match 
const passwordIsValid = bcrypt.compareSync(passowrd, user.passowrd)
if(!passwordIsValid) {return res.status(401).send({message:"invlid passowrd"})}
console.log(user)
//than we have a succefull auth
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, 
    {expiresIn: '24h'})
    res.json({token})
} catch (err){
    console.error(err.message)
    res.send(503)
}

})

export default router