import React from 'react'
import { StyleSheet} from 'react-native'
import { Input, Stack, FormControl , Container, Heading, Button, Text, Box, useToast } from 'native-base';
import { List} from 'native-base';
import {
  SafeAreaView,
  View,
  FlatList,
  StatusBar,
} from 'react-native';

// import {List,ListItem, Left, Right } from 'native-base';
import globalStyles from '../styles/global';
import {useNavigation } from '@react-navigation/native'
import {gql, useQuery} from '@apollo/client'

const OBTENER_PROYECTOS = gql`
  query obtenerProyectos {
    obtenerProyectos {
      id 
      nombre
    }
  } 
`

const Proyectos = () => {

  const navigation = useNavigation()

  // Apollo
  // loading - mientras hace la consulta esto cambia true esta cargando y luego false  - es el cargando 
  // error - Si las consultas no funcionan
  const { data , loading , error } = useQuery(OBTENER_PROYECTOS);
  console.log(data) // la primera sera el undefined 
  console.log(loading)
  console.log(error) // no hubo ningun error : undefined

  if(loading) return <Text>Cargando...</Text>

  const Item = ({nombre, proyecto}) => (
    <View >
      <Text
      onPress={ () => navigation.navigate("Proyecto", proyecto) }
      style={styles.items}  >{nombre}</Text>
    </View>
  );

    return (
        <Box
         style={[globalStyles.contenedor, {backgroundColor: '#E84347'}]}>
          <Button
          style={[globalStyles.boton, {marginTop: 30}]}
          square
          block
          onPress={() => navigation.navigate("NuevoProyecto")}
          >

            <Text style={globalStyles.botonTexto}>Nuevo Proyecto</Text>
          </Button>
          <Heading style={globalStyles.subtitulo}>Selecciona un Proyecto</Heading>
          <Box>

          <FlatList
            data={data.obtenerProyectos}  
            renderItem={(proyecto) =>
            <Item 
            nombre={proyecto.item.nombre} 
            proyecto = {proyecto.item}
            />


            }keyExtractor={proyecto => proyecto.id}
            style={styles.container}
          />
          </Box>
        </Box>

      );
}


  const styles = StyleSheet.create({
    contenido:{
      backgroundColor: '#FFF',
      marginHorizontal: '2.5%'
    },
    container: {
      padding: 10,

    },
    items:{
      backgroundColor: '#fff',
      padding: 10,
      marginVertical: 5, 
      borderRadius: 5,
    }

  });
export default Proyectos; 