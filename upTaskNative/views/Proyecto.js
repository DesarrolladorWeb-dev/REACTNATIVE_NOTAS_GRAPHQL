import React, {useState,useEffect} from 'react'
import { StyleSheet, View } from 'react-native';
import { Input, Stack, FormControl , Container, Heading, Button, Text, Box, useToast, FlatList} from 'native-base';
import { List} from 'native-base';
import globalStyles from '../styles/global';
import {gql, useMutation, useQuery} from '@apollo/client'
import {useNavigation } from '@react-navigation/native'
import Tarea from '../components/Tarea';


// Crear nuevas tareas
const NUEVA_TAREA = gql`
  mutation nuevaTarea($input: TareaInput){
    nuevaTarea(input: $input){
      nombre
      id
      proyecto
      estado
    }
  }
`
// Consulta las tareas del proyecto 
const OBTENER_TAREAS = gql`
  query obtenerTareas($input: ProyectoIDInput) {
    obtenerTareas(input: $input){
      id
      nombre
      estado
    }
  }
`;


const Proyecto = ({route}) => {

  // Obtiene un iD el Proyecto
  const {id} = route.params
  const navigation = useNavigation()
  const toast = useToast();

  // Apollo obtener Tareas
  const {data , loading , error}  = useQuery(OBTENER_TAREAS,{ //aqui si ingresamos parametros
    variables:{
      input:{
        proyecto: id
      }
    }
  })
  console.log( "AQUI LOS DATOS",data)

  // Apollo crear Tareas
  const [nuevaTarea]= useMutation(NUEVA_TAREA,{
    update(cache, {data: {nuevaTarea}}){
      const {obtenerTareas} = cache.readQuery({
        query: OBTENER_TAREAS,
        variables:{
          input:{
            proyecto: id
          }
        },
      });
      cache.writeQuery({
        query: OBTENER_TAREAS,
        variables:{
          input:{
            proyecto: id
          }
        },
        data: {
          obtenerTareas:[...obtenerTareas, nuevaTarea]  //agregamos la nueva tarea
        }
      })
    }
  })


  // State del Componente
  const [nombre , guardarNombre] = useState('');
  const [mensaje, guardarMensaje] = useState(null); 
  // validar y crear tareas
  const handleSubmit = async () => {
    if(nombre === '') {
      guardarMensaje("El nombre de la tarea es obligatorio")
      return;
    }

    // Almacenarlo en la base de datos 
    try {
      const {data} = await nuevaTarea({
        variables:{
          input:{  //todo RECORDAR QUE SI AQUI ESTA INPUT ESPORQUE EN EL RESOLVER TAMBIEN DICE INPUT
            nombre,
            proyecto: id
          }
        }
      });
      console.log(data)
      guardarNombre('')
      guardarMensaje('tarea Creada Correctamente')
      
    } catch (error) {
      console.log(error)
    }


  }
 // Muestra el mensaje toast 
 const mostrarAlerta = () => {
  toast.show({
      title: mensaje,
      isClosable: true,
      duration: 5000
});

}
useEffect(() => {
  if (mensaje) {
      mostrarAlerta();
      guardarMensaje(null);
  }
}, [mensaje]);

// Si apollo esta consultado 
if(loading) return <Text>Cargando ...</Text>


    return (
        <Box  style={[globalStyles.contenedor, {backgroundColor: '#e84347'}]}>
           <FormControl style={{ padding: 12}}>
                <Input
                    style={globalStyles.input} w="100%" 
                    placeholder='Nombre Tarea'
                    value={nombre}
                    onChangeText={texto => guardarNombre(texto)} 
                />
                <Button
                square
                block
                style={globalStyles.boton}
                onPress={() => handleSubmit()} 
                >
                 <Text style={globalStyles.botonTexto}>Crear Tarea</Text>
                </Button>
            </FormControl>
            <Heading style={globalStyles.subtitulo}> Tareas: {route.params.nombre}</Heading>
            <Box>
              <FlatList
                  data={data.obtenerTareas}  
                  renderItem={(tarea) =>
                  <Tarea 
                  tarea={tarea.item} 
                  proyectoId={id}
                  />
                  }keyExtractor={tarea => tarea.id}
                  style={styles.container}
              />
            
            </Box>
            {mensaje && mostrarAlerta()}
        </Box>
      );
}
const styles = StyleSheet.create({
  contenido: {
    backgroundColor: '#FFF',
    marginHorizontal: '2.5%'
  },
  container: {
    padding: 10,

  },
})
export default Proyecto;