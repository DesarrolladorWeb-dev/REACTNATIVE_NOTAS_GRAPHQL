import React,{useEffect, useState} from 'react';
import {View} from 'react-native'
import { Input, Stack, FormControl , Container, Heading, Button, Text, Box, useToast } from 'native-base';
import globalStyles from '../styles/global';
import {useNavigation } from '@react-navigation/native'
import { gql, useMutation } from '@apollo/client'

const NUEVO_PROYECTO = gql`
    mutation nuevoProyecto ($input: ProyectoInput){
        nuevoProyecto(input : $input){
            nombre
            id
        }
    }
`
// Actualizar el cache
const OBTENER_PROYECTOS = gql`
  query obtenerProyectos {
    obtenerProyectos {
      id 
      nombre
    }
  } 
`

const NuevoProyecto = () => {

    // navigation 
    const navigation = useNavigation()
    const toast = useToast();

    // State del componente
    const [nombre, guardarNombre] = useState('')
    const [mensaje, guardarMensaje] = useState(null);

    // Apollo 
    const [nuevoProyecto] = useMutation(NUEVO_PROYECTO, {
        update(cache, { data: {nuevoProyecto}}){ //actualizamos con la respuesta de data
            const {obtenerProyectos} = cache.readQuery({query: OBTENER_PROYECTOS});
            cache.writeQuery({
                query: OBTENER_PROYECTOS,
                data : {obtenerProyectos: obtenerProyectos.concat([nuevoProyecto])} // que cache vamos a actualizar
            })
        } 
    });

    // Validar Crear Proyecto 
    const handleSubmit = async() => {
        if(nombre === ''){
            guardarMensaje('El nombre del Proyecto es Obligatorio');
            return;
        }
        // Guardar el Proyecto en la base de datos
        try {
            const {data} = await nuevoProyecto({
                variables: {
                    input: {
                        nombre
                    }
                }
            });
            // console.log(data)
            guardarMensaje('Proyecto Creado Correctamanet')
            navigation.navigate("Proyectos");
        } catch (error) {
            // console.log(error);
            guardarMensaje(error.message.replace('GrapQL error:', ''))

        }

        // Guarda el Proyecto en la base de datos
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

  return (
      <Box
       style={[globalStyles.contenedor, {backgroundColor: '#E84347'}]}>
        <View style={globalStyles.contenido}>

            <Heading style={globalStyles.subtitulo}>Nuevo Proyecto</Heading>
            <FormControl>
                <Input
                    style={globalStyles.input} w="100%"
                    placeholder='Nombre del Proyecto'
                    onChangeText={texto => guardarNombre(texto)} 
                />
            </FormControl>

                 <Button
                    style={[globalStyles.boton, {marginTop: 30}]}
                    square
                    block
                    onPress={() => handleSubmit()}
                    >

                        <Text style={globalStyles.botonTexto}>Crear Proyecto</Text>
                </Button>
                {mensaje && mostrarAlerta()}
        </View>
      </Box>

    );
}
export default NuevoProyecto;