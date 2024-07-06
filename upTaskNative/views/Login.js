import React,{useState, useEffect} from 'react'
import { View } from 'react-native'
import { Input, Stack, FormControl , Container, Heading, Button, Text, Box, useToast} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../styles/global';
import AsyncStorage from '@react-native-community/async-storage'

// Apollo si es query es useQuery
import {gql, useMutation} from '@apollo/client'
const AUTENTICAR_USUARIO=gql`
    mutation autenticarUsuario($input: AutenticarInput){
        autenticarUsuario(input: $input){
        token
        }
    }
`;

const Login = () => {



    // State del Formulario
    const [email, guardarEmail] = useState('');
    const [password, guardarPassword] = useState('');
    const [mensaje, guardarMensaje] = useState(null);

    // React Navigation
    const navigation = useNavigation();
    const toast = useToast();
    // Mutation de Apollo 
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);


    // Cuando el presione en iniciar session
    const handleSubmit = async () => {
           // validar
           if ( email === '' || password === '') {
            // Mostrar un erro 
            guardarMensaje('Todos los campos son obligatorios');
            return ;
            }
            console.log("paso")
        try {
            //Autenticar el usuario 
            const { data } = await autenticarUsuario({
                variables : { //obligatorio en todos los mutation
                    // como es un input lo que se escribe en variables del consola de apolo
                    input:{
                        email,
                        password
                    }
                }
            })
            // console.log(data)
            const {token} = data.autenticarUsuario
            // colocar el token en storage 
            await AsyncStorage.setItem('token', token);
            
            // Redireccinar a Proyectos 
            navigation.navigate("Proyectos")
        } catch (error) {
            console.log(error)
            // Si hay un error mostrar
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
                        onChangeText={texto => guardarEmail(texto.toLowerCase())}
                        value={email}
                        style={globalStyles.input}   m={4} mx="4"  w="100%" placeholder="Correo" />
                        <Input
                        onChangeText={texto => guardarPassword(texto)}
                        style={globalStyles.input}   mb={14}  mx="4"  w="100%" placeholder="Password" secureTextEntry={true} />
                   
                    </FormControl>
                    <Button
                        ml={4}
                        mr={4}
                        square
                        block
                        style= {globalStyles.boton}
                        onPress={() => handleSubmit() }
                    ><Text style={globalStyles.botonTexto} >Iniciar Session</Text></Button>
                    <Text
                    onPress={() => navigation.navigate('CrearCuenta')}
                    style= {globalStyles.enlace} >Crear Cuenta</Text>
                     {mensaje && mostrarAlerta()}
                </View>
            </Box>


  );
}

export default Login