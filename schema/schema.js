const graphql = require('graphql')
const axios = require('axios')
const dotenv = require('dotenv')
const { customerListData, getCustomerData, insertUser, deleteUser, updateUser, updateUserData } = require('../db/dbCrud');

dotenv.config()
const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLSchema,GraphQLNonNull
} = graphql

const CustomreType = new GraphQLObjectType({
    name: "Customer",
    fields: ()=>({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        address: { type: GraphQLString },
        phone: { type: GraphQLString },
        city: { type: GraphQLString },
        country: { type: GraphQLString },

    })
})


const UserType = new GraphQLObjectType({
    name: "User",
    fields: ()=> ({
        customer_id: { type: GraphQLInt },
        store_id: { type: GraphQLInt },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        customer :{
            type:CustomreType,
            resolve(source,args){
                console.log(source,args)
                return  customerListData({id:source.customer_id}).then(resp=> resp.data[0]).catch(e=>({status:false,message:"unable to get data"}))
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { customer_id: { type: GraphQLInt } },
            resolve(source, args) {
                return getCustomerData({id:args.customer_id}).then(resp=> resp.data[0]).catch(e=>({status:false,message:"unable to get data"}))
            }
        },
        customer:{
            type:CustomreType,
            args:{id:{type:GraphQLInt}},
            resolve(parent,args){
                return  customerListData({id:args.id}).then(resp=> resp.data[0]).catch(e=>({status:false,message:"unable to get data"}))
            }
        }
    }
})
const mutation = new GraphQLObjectType({
    name:"Mutation",
    fields:{
        addUser:{
            type:UserType,
            args:{
                store_id: { type: new GraphQLNonNull(GraphQLInt) },
                first_name: { type: new GraphQLNonNull(GraphQLString) },
                last_name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(source,args){
                console.log(args)
                return insertUser(args).then(resp=> resp).catch(err=> err.message)
            }
        },
        deleteUser:{
            type:UserType,
            args:{id:{type:new GraphQLNonNull(GraphQLInt)}},
            resolve(source,args){
               return deleteUser(args.id).then(rs=>rs).catch(e=>{console.log(e)})
            }

        },
        updateUser:{
            type:UserType,
            args:{
                customer_id:{type:new GraphQLNonNull(GraphQLInt)},
                first_name: { type: new GraphQLNonNull(GraphQLString) },
                last_name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(source,args){
                return updateUserData(args).then(rs=> rs).catch(e=>e)
            }
        }
    }
})

const RootSchema = new GraphQLSchema({ query: RootQuery ,mutation})

module.exports = RootSchema;