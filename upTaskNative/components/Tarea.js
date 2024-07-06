import React from 'react'
import { Input, Stack, FormControl , Container, Heading, Text, Box, useToast , Icon   } from 'native-base';
import { VStack, HStack} from 'native-base';
import { StyleSheet, View, TouchableOpacity , Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import {gql, useMutation} from '@apollo/client';

// variables es simbolo de dolar
const ACTUALIZAR_TAREA = gql`
  mutation actualizarTarea($id: ID!, $input:TareaInput, $estado:Boolean){
    actualizarTarea(id: $id, input: $input, estado: $estado){
      nombre
      id
      proyecto
      estado
    }
  }
`
const ELIMINAR_TAREA = gql`
  mutation eliminarTarea($id: ID!){
    eliminarTarea(id: $id)
  }
`;
// Consulta las tareas 
const OBTENER_TAREAS = gql`
  query obtenerTareas($input: ProyectoIDInput) {
    obtenerTareas(input: $input){
      id
      nombre
      estado
    }
  }
`;


const Tarea = ({tarea, proyectoId}) => {
    console.log(proyectoId)
    
  // Apollo
  const [actualizarTarea ] = useMutation(ACTUALIZAR_TAREA);
  const [eliminarTarea ] = useMutation(ELIMINAR_TAREA,{
    update(cache){
      const {obtenerTareas} = cache.readQuery({
        query: OBTENER_TAREAS,
        variables:{
          input:{
            proyecto: proyectoId
          }
        }
      });
      cache.writeQuery({
        query: OBTENER_TAREAS,
        variables:{
          input:{
            proyecto: proyectoId
          }
        },
        data:{
          obtenerTareas:obtenerTareas.filter(tareaActual => tareaActual.id !== tarea.id)
        }

      })
    }
  });

  // Cambia el estado de una tarea a completo o incompleto
  const cambiarEstado = async () => {
    // obtener el ID de la tarea
    const {id} = tarea
    // console.log(!tarea.estado); 
    try {
      const {data} = await actualizarTarea({
        variables:{
          id,
          input:{
            nombre: tarea.nombre
          },
          estado:!tarea.estado //sera ingresara lo contrario del estado
        }
      })
      console.log("actualizado estado", data)
    } catch (error) {
      console.log(error)
    }
  }
  // Dialogo para eliminar  o no una tarea

  const mostrarEliminar = () => {
    Alert.alert('Eliminar Tarea', 'Deseas eliminar esta tarea?', [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Confirmar',
        onPress: () => eliminarTareaDB()
      }
    ])
  }

  // Eliminar tarea de la base de datos 
  const eliminarTareaDB = async () => {
    const {id} = tarea;
    try {
      const {data} = await eliminarTarea({
        variables:{
            id
        }
      });
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
    return (  
        <>
        <TouchableOpacity
        onPress={() => cambiarEstado()}
        onLongPress={() => mostrarEliminar()}
        >
        <View style={styles.items}
        >

            
              <VStack space={3}  w="100%"
              >
                  <HStack justifyContent="space-between">
                    <Text
                    >{tarea.nombre}
                    </Text>
                  {tarea.estado ? (
                    <Icon 
                      style={[styles.icono, styles.completo]}
                      as={Ionicons} name="checkmark-circle-outline" />

                  ): (
                    <Icon 
                      style={[styles.icono, styles.incompleto]}
                      as={Ionicons} name="checkmark-circle-outline" />

                  )}

                  </HStack>
              </VStack>
          
        </View>
        </TouchableOpacity>
        </>
            
    );
}
const styles = StyleSheet.create({

  
    items:{
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      marginVertical: 5, 
      borderRadius: 5,
    },
    icono :{
      
      
    },
    completo:{
      color: 'green'
    },
    incompleto:{
      color: 'black'

    }

  });
export default Tarea;