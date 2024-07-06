import client from './config/apollo';
import { ApolloProvider } from '@apollo/client';
// import {Root} from 'native-base'

import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import {NativeBaseProvider} from 'native-base';

import CrearCuenta from './views/CrearCuenta';
import Login from './views/Login';
import Proyectos from './views/Proyectos';
import NuevoProyecto from './views/NuevoProyecto';
import Proyecto from './views/Proyecto';

const App = () => {
  return (
    <ApolloProvider client={client} >
    <NativeBaseProvider >
        <NavigationContainer>
        <Stack.Navigator
            initialRouteName='Login'
        >
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                title: "Iniciar Session",
                headerShown: false  //Quitara la Barra Header
              }}
            />
            <Stack.Screen
              name="CrearCuenta"
              component={CrearCuenta}
              options={{
                title: "Crear Cuenta",
                headerStyle: {backgroundColor: '#283038'},
                headerTintColor:'#fff',
                headerTitleStyle:{
                  fontWeight: 'bold'
                }
              }}
            />
            <Stack.Screen
              name="Proyectos"
              component={Proyectos}
              options={{
                title: "Proyectos",
                headerStyle: {backgroundColor: '#283038'},
                headerTintColor:'#fff',
                headerTitleStyle:{
                  fontWeight: 'bold'
                }
              }}
            />
              <Stack.Screen
              name="NuevoProyecto"
              component={NuevoProyecto}
              options={{
                title: "Nuevo Proyecto",
                headerStyle: {backgroundColor: '#283038'},
                headerTintColor:'#fff',
                headerTitleStyle:{
                  fontWeight: 'bold'
                }
              }}
            />

              <Stack.Screen
              name="Proyecto"
              component={Proyecto}
              options={({route}) => ({
                title: route.params.nombre,
                headerStyle: {backgroundColor: '#283038'},
                headerTintColor:'#fff',
                headerTitleStyle:{
                  fontWeight: 'bold'
                }
              })}
            />


        </Stack.Navigator>
    </NavigationContainer>
</NativeBaseProvider>
</ApolloProvider>

  );
}
const styles = StyleSheet.create({

});

export default App
