//Account creation for both admin and employee
const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const verifyJWT = require('../middleware/verifyJWT')

//Create admin, employee creation will be given to admin
router.post("/admin", async function(req, res) {
    // Admin Vars
    const user_id = crypto.randomUUID()
    const username = req.query.username
    //salt pass
    const salt = await bcrypt.genSalt(2)
    const password = await bcrypt.hash(req.query.password, salt);
    const email = req.query.email
    const f_name = req.query.f_name
    const l_name = req.query.l_name


    //Business Vars
    const bizName = req.query.bizName
    const bizID = crypto.randomUUID()   

    
    //SQL Statements
    const sqlBizSt = `INSERT INTO businesses VALUES('${bizID}','${bizName}')`
    const sqlUserSt = `INSERT INTO admins(user_id, email, password, business, f_name, l_name, username) VALUES('${user_id}','${email}','${password}','${bizID}', '${f_name}','${l_name}', '${username}')`
    //const sqlUser_RoleST = `INSERT INTO user_roles(role_id, user_id) VALUES('1','${userID}')`
    
    
    //Begin trasnsaction to add admin
    await pool.beginTransaction();

    //Create business of admin
    console.log(`Inserting business: ${bizName}`)
    const [bizEntry] = await pool.query(sqlBizSt)


    
    //Create Admin Entry 
    console.log(`Inserting new admin: ${username}`)
    const [userEntry] = await pool.query(sqlUserSt)
    
    

    //Commit transaction
    await pool.commit();
    const returnObj = {
        'status': 200,
        'user_id': user_id
    };
    // // //Completed
    res.json(returnObj)
})


module.exports = router