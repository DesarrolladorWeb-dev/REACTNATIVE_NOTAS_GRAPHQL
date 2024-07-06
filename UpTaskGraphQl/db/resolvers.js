const Usuario = require('../models/Usuario')
const Proyecto = require('../models/Proyecto')
const Tarea = require('../models/Tarea')

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')


require('dotenv').config({path:'variables.env' })
// Crear y firma un JWT
const crearToken = (usuario, secreta, expiresIn)  => {
  const {id, email, nombre} = usuario;
  // console.log(usuario)
  // Creara el token
  return  jwt.sign( {id, email, nombre}, secreta, {expiresIn} );
}



// Resolver son funciones que se van a conectar con nuestros typeDefinition o con nuestra base de datos
const resolvers = {
    // vemos que son Query entonces tiene que ser Querys
  Query: {
    // es un un arrow funcion que da por implicito el return de los cursos
    // SOLO el context porque requerimos los proyectos de la persona que esta autenticada 
    obtenerProyectos: async (_, {}, ctx) => {
        const proyectos = await Proyecto.find({creador: ctx.usuario.id});

        return proyectos;
    },
    obtenerTareas: async (_, {input}, ctx) => {
      // Solo traera de la persona que esta autenticada y que pertenece al proyecto que le esta pasando por el input
      const tareas = await Tarea.find({creador: ctx.usuario.id}).where('proyecto').equals(input.proyecto)

      return tareas
    }
  },
  Mutation: {
    // el primero es el type padre - nunca lo use
    // el segundo : argumentos que se le pasa al valor - input permitira leer lo que se le pasa
    // tercero :(se le conoce como el context) se comparte en todos los resolver (Query, Mutacion) 
    // lo estara revisando todo el tiempo , es bueno para autenticar 

    crearUsuario : async (_, {input}) => {
      const { password , email} = input
      const existeUsuario = await Usuario.findOne({email});
      // si el usuario existe 
      if(existeUsuario){
        throw new Error('El usuario ya esta registrado')
      }

      try {

        // Hashear password
        const salt = await bcryptjs.genSalt(10)
        input.password = await bcryptjs.hash(password, salt);

  
        // Registrar nuevo usuario
        const nuevoUsuario = new Usuario(input);
        // console.log(nuevoUsuario)

        nuevoUsuario.save(); //guardara en la base dedatos
        return "Usuario Creado Correctamente" //lo retornara como dice en el schema.js
      } catch (error) {
        console.log(error)
      }

    },
    autenticarUsuario:  async (_, {input}) => {
      const { password , email} = input
      // Si el usuario existe 
      const existeUsuario = await Usuario.findOne({email});
      // si el usuario existe 
      if(!existeUsuario){
        throw new Error('El usuario no existe')
      }

      // Si el password es correcto 
      const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password)
      if(!passwordCorrecto){
        throw new Error('Password Incorrecto')
      }
      // Dar  acceso a la app
      // el token sera el return
      return {
        // el Primero tendra toda la info de un usuario , la palabra secreta para hashear el uuario
        token : crearToken(existeUsuario, process.env.SECRETA, '9hr')
      }
    },
    nuevoProyecto:  async (_, {input}, ctx) => {
      console.log('Desde resolver' , ctx)

      try {
        const proyecto = new Proyecto(input);

        // Asociar el creador 
        proyecto.creador = ctx.usuario.id;

        // almacenar en la DB
        const resultado = await proyecto.save()
        //retornara mucha informacion pero como en el schema esta solamente esta: schema.js
        // type Proyecto {   //Por eso solo tendremos solo esta info como respuesta 
        //   nombre: String
        //   id: ID
        // }
        return resultado; 

      } catch (error) {
        console.log(error)
      }
    },
    actualizarProyecto: async (_, {id,input}, ctx) => {
      // Revisar si el proyecto existe o no 
      let proyecto = await Proyecto.findById(id);
      if(!proyecto) {
        throw new Error('Proyecto no encontrado');
      }
      // Revisar que si la persona que trata de editarlo, es el creaador
      console.log(proyecto) //VEMOS QUE ES UN OBJETO
      if(proyecto.creador.toString() !== ctx.usuario.id){ //la persona que lo creao y quien la trata de modificar no son lo mismo 
        throw new Error('No tienes las credenciales para editar ');
      }

      // Guardar el proyecto
      proyecto = await Proyecto.findOneAndUpdate({ _id: id}, input,{new: true})
      return proyecto;
    },
    eliminarProyecto: async (_, {id,input}, ctx) => {
       // Revisar si el proyecto existe o no 
       let proyecto = await Proyecto.findById(id);
       if(!proyecto) {
         throw new Error('Proyecto no encontrado');
       }
       // Revisar que si la persona que trata de editarlo, es el creaador
       console.log(proyecto) //VEMOS QUE ES UN OBJETO
       if(proyecto.creador.toString() !== ctx.usuario.id){ //la persona que lo creao y quien la trata de modificar no son lo mismo 
         throw new Error('No tienes las credenciales para editar ');
       }
      //  Eliminar 
      await Proyecto.findOneAndDelete({_id : id});
      return "Proyecto Eliminado"
    },
    nuevaTarea:  async (_, {input}, ctx) => {
      try {
        const tarea = new Tarea(input)
        tarea.creador =  ctx.usuario.id
        const resultado = await tarea.save()
        console.log(resultado)
        return resultado
      } catch (error) {
        console.log(error)
      }
    },
    actualizarTarea:   async (_, {id,input, estado}, ctx) => {
      // Si la tarea existe o no 
      let tarea = await Tarea.findById(id);
      if(!tarea){
        throw new Error('Proyecto no encontrado');
      }
      // Si la persona que edita es el creador 
       if(tarea.creador.toString() !== ctx.usuario.id){ //la persona que lo creao y quien la trata de modificar no son lo mismo 
         throw new Error('No tienes las credenciales para editar ');
       }
      //  Asignar estado 
      input.estado = estado;

      // Guardar y retornar la tarea
      // le pasamos el id y le pasamos el input el objeto y que nos traigue todo la info 
      tarea = await Tarea.findOneAndUpdate({ _id: id}, input,{new: true});

      return tarea

    },
    eliminarTarea:   async (_, {id,input, estado}, ctx) => {
          // Si la tarea existe o no 
          let tarea = await Tarea.findById(id);
          if(!tarea){
            throw new Error('Proyecto no encontrado');
          }
          // Si la persona que edita es el creador 
          if(tarea.creador.toString() !== ctx.usuario.id){ //la persona que lo creao y quien la trata de modificar no son lo mismo 
            throw new Error('No tienes las credenciales para editar ');
          }
          
          // Eliminar 
          await Tarea.findOneAndDelete({_id: id});
          return "Tarea Eliminada"
    }

  }
};
module.exports = resolvers