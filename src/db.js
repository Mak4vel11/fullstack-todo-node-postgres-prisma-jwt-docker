import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync(':memory:')


//setup database when boot app 
//Execute SQL statemnts from string 
//2 table 1 for user 1 for todo = that is gonna associate with the user 
db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,                        
        username TEXT UNIQUE,
        password TEXT   
    )
    `)

    db.exec(`
            CREATE TABLE todos (
               id INTEGER PRIMARY KEY AUTOINCREMENT ,
               user_id INTEGER, 
               task TEXT,
               completed BOOLEAN DEFAULT 0 ,
               FOREIGN KEY(user_id) REFERENCES users(id)
            )
            `)

            export default db