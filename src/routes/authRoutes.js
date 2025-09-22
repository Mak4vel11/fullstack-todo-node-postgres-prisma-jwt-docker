import express from "express";
import bcrypt from "bcryptjs";
//auth key for autentifiaciton
import jwt from "jsonwebtoken";
//import database
import db from "../db.js";
import prisma from "./prismaClient.js";

//how to configure endpoint or routes when they are not defined
//in original file

const router = express.Router();

//register new user endpoind /auth/register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  //encrpyt the password
  const hashedPassword = bcrypt.hashSync(password, 8);
  console.log(hashedPassword);
  console.log(username);

  //save the new user and hashed password to the db
  //prepare method we run a sql qurey
  // we can inject value sql qurey
  try {
    //like this we have created a user , using js syntax 
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })

    //now that we have a user i want to add their first todo for them
    //we assign a default to do and we create a special token
    const defaultTodo = `Hello :) Add your first todo `;
    await prisma.todo.create({
      data:{
        task: defaultTodo,
        userId: user.id 
      }
    })
  

    //create a token
    //token is importat cuz once we loggin they create todo they
    //are associate a special token or key with that network request
    //its like a apikey
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.sendStatus(503);
    //500-599 means that the server has broken down
    //this is what will happen if we fails to save a user
    //to the database
  }
});

router.post("/login", async (req, res) => {
  //we get their email , and we look up the password associated with
  //that email in the database
  //but we get it ad see its encrypted which means that we cannot compare
  //it to the one the uer just user trying to login , so what we can compare
  //get the encrypted pw and compare it to the pw in the database

  const { username, password } = req.body;

  try {
    //find our unique user 
    const user = await prisma.user.findUnique({
      where: {
        username: username 
      }
    })

    //if they dont have an acc and they want to login
    if (!user) {
      return res.status(404).send({ message: "USER NOT FOUND" });
    }
    //hash pw and compered to hash pw
    //will return a boolean
    //then pas dont match
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "invlid passowrd" });
    }
    console.log(user);
    //than we have a succefull auth
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.sendStatus(503);
  }
});

export default router;
