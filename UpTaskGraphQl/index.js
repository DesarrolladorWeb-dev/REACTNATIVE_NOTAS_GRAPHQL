const { ApolloServer } = require('apollo-server');

const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');
const jwt = require('jsonwebtoken')
require('dotenv').config({path:'variables.env' })

// Conectar la BD
conectarDB();

const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  // estara en todos los resolver y el req es igual al del node
  context: ({req}) => {
    console.log(req.headers['authorization'])
    // No todos los usuarios van a estar autenticados si no existe un String vacio
    const token = req.headers['authorization'] || '' 
    if(token){
      try {
        const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA) //nos dara la info ingresada 
        console.log("el usuario aqui ",usuario)
        return{
          // El nombre del objeto sera este
          usuario
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
});

const PORT = 4003;

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`Servidor listo en la URL ${url}`);
});