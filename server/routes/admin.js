const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const crypto = require('crypto')
const bcrypt = require('bcrypt')


router.get("/tester", async function(req, res) {
    const getter = `SELECT * FROM materials`
    const [getMats] = await pool.query(getter)
    res.json(getMats[1].mat_id)
})

router.post("/create-admin", async function (req,res) {
    // Admin Vars
    const userID = crypto.randomUUID()
    const userName = req.query.userName
    //salt pass
    const salt = await bcrypt.genSalt(2)
    const passWord = await bcrypt.hash(req.query.passWord, salt);
    const email = req.query.email
    const f_name = req.query.f_name
    const l_name = req.query.l_name

    //Business Vars
    const bizName = req.query.bizName
    const bizID = crypto.randomUUID()   

    
    //SQL Statements
    const sqlBizSt = `INSERT INTO bussinesses VALUES('${bizID}','${bizName}')`
    const sqlUserSt = `INSERT INTO users VALUES('${userID}','${userName}','${passWord}','${bizID}','${email}','${f_name}','${l_name}')`
    const sqlUser_RoleST = `INSERT INTO user_roles(role_id, user_id) VALUES('1','${userID}')`
    
    
    //Begin trasnsaction to add admin
    await pool.beginTransaction();

    //Create business of admin
    console.log(`Inserting business: ${bizName}`)
    const [bizEntry] = await pool.query(sqlBizSt)


    
    //Create Admin Entry 
    console.log(`Inserting new admin: ${userName}`)
    const [userEntry] = await pool.query(sqlUserSt)
    
    //Create admin user_role entry
    console.log("Creating corresponding user_role entry")
    const [user_RoleEntry] = await pool.query(sqlUser_RoleST)

    //Commit transaction
    await pool.commit();
    
    // // //Completed
    res.json("Success")

})



router.post('/addLocation', async function (req,res) {

    //Get vars
    const bizID = req.query.bizID


    //Begin trasnsaction to add admin
    await pool.beginTransaction();

    
    
    //Insert location
    //Location info
    const locationID = crypto.randomUUID()
    const locationName = req.query.locationName
    sqlst = `INSERT INTO locations(location_id, location_name, business_id) VALUES('${locationID}','${locationName}','${bizID}')`
    pool.query(sqlst)

    //Insert default mats (will be in 4 loop)
    //Location Mats Info 
    //Get all material possibilities
    const getter = `SELECT * FROM materials`
    const [getMats] = await pool.query(getter) 
    
    for (let i = 0; i < getMats.length; i++) {
        const locationmatsID = crypto.randomUUID()
        const currMatID = getMats[i].mat_id
        sqlst = `INSERT INTO locationmats(location_mats_id, location, material) VALUES('${locationmatsID}','${locationID}','${currMatID}');`
        pool.query(sqlst)
    }

    pool.commit()

    res.json(`Added location ${locationName} with ID of ${locationID}`)
})


module.exports = router