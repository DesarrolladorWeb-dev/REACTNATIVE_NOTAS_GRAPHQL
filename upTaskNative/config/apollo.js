import {ApolloClient, InMemoryCache } from '@apollo/client'
// import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink , createHttpLink} from 'apollo-link-http'
import { setContext } from 'apollo-link-context';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'

const httpLink = createHttpLink({
  uri: Platform.OS === 'ios' ? 'http://localhost:4003' : 'http://192.168.1.10:4003/'
})
const authLink = setContext(async (_ , {headers}) => {
  // Leer el token
  const token = await AsyncStorage.getItem('token');
  //  De esta manera le pasamos el token al servidor por medio de authorization
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''

    }
  }
})

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link: authLink.concat(httpLink)
  // link: new HttpLink({
  //   uri,
  // }),
});

export default client;
