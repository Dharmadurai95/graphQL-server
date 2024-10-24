const express = require('express');
const dotenv = require('dotenv')

dotenv.config()
const {hostport}= process.env;
const server = express()
server.use(express.json()); 
server.use(express.urlencoded({urlencoded:true}))

const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');
const { customerListData, getCustomerData } = require('./db/dbCrud');




server.use('/graphql',expressGraphQL({
    schema,
    graphiql:true
}))

server.get('/api/v1/userlist/:userId',async(req,res)=>{
    const resp =  await getCustomerData({id:req.params.userId})
    res.send(resp)
})
server.get('/api/v1/customer_list/:userId',async(req,res)=>{
    const resp =  await customerListData({id:req.params.userId})
    res.send(resp)
})
server.listen(hostport,()=> console.log('server running in PORT 4000'))