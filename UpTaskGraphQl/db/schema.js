const { gql } = require('apollo-server');

// TODO En GraftQl - solo te devolvera lo que quieres retornar(exactamente)  y Rest no porque te da todo...

// * Se llama type definition porque tienes que describir la forma que tiene que tener los datos y que es lo que deseas obtener , en este caso quiero que solo sea el Titulo
// [Proyecto] nos dara un arreglo de cursos
// Query :  piensa como el select en sql o el /get lo que va a obtener los datos
// Mutation : para crear y el estring de su funcion es el mensaje "se agrego correctamente"
// input : SERA LA ENTRADA DE DATOS (el Nombre debe ser Describe lo que hace)
//crearUsuario(input: UsuarioInput) : String ( la funion tomara el imput de UsuarioInput y retornara String)
// para que sean obligatorios uso : !
//  autenticarUsuario(input: AutenticarInput ) : Token: RETORNARA UN TOKEN y el creamos nuestro token que sera un String
// nuevoProyecto(input: proyectoInput ): Proyecto  Nos retornara todo el proyecto un objeto
// type Proyecto {   RECORDEMOS QUE ESTA ES LA FORMA DEL RETORNO
//   nombre: String
//   id: ID
// }

const typeDefs = gql`

type Token{
  token: String
}

type Proyecto {
  nombre: String
  id: ID
}
type Tarea{
  nombre: String
  id: ID
  proyecto: String
  estado: Boolean
}

type Query {
  obtenerProyectos: [Proyecto]
  # las tareas se tienen que filtrar por proyecto nos retornara un arreglo de tareas
  obtenerTareas(input: ProyectoIDInput) : [Tarea]

}
input ProyectoIDInput{
  proyecto: String!
}

input UsuarioInput {
  nombre: String!
  email: String!
  password: String!
}
input AutenticarInput{
  email: String!
  password: String!
}
input ProyectoInput {
  nombre: String!
}

input TareaInput {
  nombre: String!
  proyecto: String
}

type Mutation {
  # Usuarios
  crearUsuario(input: UsuarioInput) : String
  autenticarUsuario(input: AutenticarInput ) : Token
  # Proyectos
  nuevoProyecto(input: ProyectoInput ): Proyecto
  actualizarProyecto(id: ID! , input : ProyectoInput) : Proyecto
  eliminarProyecto(id: ID!) : String

  #Tareas
  nuevaTarea(input: TareaInput) : Tarea
  actualizarTarea(id: ID! , input : TareaInput, estado: Boolean): Tarea
  eliminarTarea(id: ID! ): String
}
`;

module.exports = typeDefs