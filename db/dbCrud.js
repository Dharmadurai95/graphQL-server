const db = require('./db')


async function getCustomerData({ id }) {
    try {
        // const result = await db.query(`select * from $1 where $2 = $3`,[tableName,idField,id])
        const result = await db.query(`select * from customer where customer_id = $1`, [id])
        return {
            status: true,
            data: result.rows
        }
    } catch (e) {
        console.log(e)
        return { status: false, message: "unable to get data " + e.message }
    }
}
async function customerListData({ id }) {
    try {
        const result = await db.query(`select * from customer_list where id = $1`, [id])
        return {
            status: true,
            data: result.rows
        }
    } catch (e) {
        console.log(e)
        return { status: false, message: "unable to get data " + e.message }
    }
}

async function insertUser({ store_id, first_name, last_name, email }) {
    try{

        const updatedResp =await  db.query(`insert into customer (store_id, first_name, last_name, email, address_id, activebool, create_date, last_update, active) values($1,$2,$3,$4,$5,$6,CURRENT_DATE, NOW(),$7) RETURNING *`,[store_id,first_name,last_name,email, 10, true, 1])
        return updatedResp.rows[0]
    }catch(e){
        console.log(e,'error while inset the record')
    }
}

async function deleteUser(id){
    try{
        const reponse = await db.query('delete from customer where customer_id=$1 returning *',[id])
        console.log(reponse.rows)
        return reponse.rows[0]

    }catch(e){
        console.log("error occured while deleting the record",e.message)
    }
}
async function updateUserData({first_name,last_name,customer_id}){
    try{

        const response = await db.query(`update customer set first_name=$1 ,last_name=$2 where customer_id=$3 returning *`,[first_name,last_name,customer_id]);
        return response.rows[0]
    }catch(e){
        console.log(e)
    }
}

module.exports = {
    getCustomerData,
    customerListData,insertUser,deleteUser,updateUserData
}