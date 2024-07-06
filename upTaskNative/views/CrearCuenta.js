import React, { useState, useEffect} from 'react'
import { View } from 'react-native'
import { Input, Stack, FormControl , Container, Heading, Button, Text, Box, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../styles/global';

// Apollo 
import {gql, useMutation} from '@apollo/client'
const NUEVA_CUENTA = gql`
    mutation crearUsuario($input: UsuarioInput ){
        crearUsuario(input: $input)
    }

`;

const CrearCuenta =  () => {
        // State del Formulario
        const [nombre, guardarNombre] = useState('');
        const [email, guardarEmail] = useState('');
        const [password, guardarPassword] = useState('');

        const [mensaje, guardarMensaje] = useState(null);

    // React Navigation
    const navigation = useNavigation();
    const toast = useToast();

    // Mutation de apollo
    const [crearUsuario ] = useMutation(NUEVA_CUENTA);

    // Cuando el usuario presuona en crear cuenta
    const handleSubmit= async () => {
        // validar
        if (nombre === '' || email === '' || password === '') {
            // Mostrar un erro 
            guardarMensaje('Todos los campos son obligatorios');
            return 
        }
        // password al menos 6 caracteres
        if(password.length < 6 ){
            guardarMensaje('El password debe ser de al menos 6 caracteres');
            return 
        }
        // guardar el usuario
        try {
            const { data } = await crearUsuario({
                variables : { //obligatorio en todos los mutation
                    input:{
                        nombre,
                        email,
                        password
                    }
                }
            })
            guardarMensaje(data.crearUsuario) //que obtenemos del servidor "Usuario correctamente"
            navigation.navigate('Login')
        } catch (error) {
            guardarMensaje(error.message.replace('GrapQL error:', ''))
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

    return (
            <Box alignItems="center" justifyContent="center" style={[globalStyles.contenedor,{backgroundColor: '#e84347'}]}>
            <View style={globalStyles.contenido}>
                <Heading style= {globalStyles.titulo}>
                    UpTask
                </Heading>
                    <FormControl>
                        <Input 
                        onChangeText={ texto => guardarNombre(texto)}
                        style={globalStyles.input}   mx="4"  w="100%" placeholder="Nombre" />
                        <Input  
                        onChangeText={ texto => guardarEmail(texto)}
                        style={globalStyles.input}   m={4} mx="4"  w="100%" placeholder="Correo" />
                        <Input 
                        onChangeText={ texto => guardarPassword(texto)}
                        style={globalStyles.input}   mb={14}  mx="4"  w="100%" placeholder="Password" secureTextEntry={true} />
                    </FormControl>
                    <Button
                        ml={4}
                        mr={4}
                        square
                        block
                        style= {globalStyles.boton}
                        onPress={() => handleSubmit()}
                    ><Text style={globalStyles.botonTexto} >Crear Cuenta</Text></Button>
                    {/* UNA VEZ QUE MENSAJE DEJE DE SER NULL se ejecutara la funcion */}
                    {mensaje && mostrarAlerta()
                    } 
                </View>
            </Box>


  );
}

export default CrearCuenta