import {StyleSheet} from 'react-native'

const globalStyles = StyleSheet.create({
    contenedor : {
        flex: 1,

        },
    contenido: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: '2.5%',
        flex: 1
    },
    titulo: {
        textAlign: 'center',
        padding: 20,
        marginBottom: 20,
        fontSize: 39,
        fontWeight: 'bold',
        color: '#FFF'
    },
    subtitulo:{
        textAlign: 'center',
        padding: 20,
        marginBottom: 20,
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop:20
    },
    input:{
        backgroundColor: '#FFF',
        // marginBottom: 20,
    },
    boton:{
        backgroundColor: '#28303B',
        marginTop:20
    },
    botonTexto:{
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#FFF'
    },
    enlace:{
        color: '#FFF', 
        marginTop:60,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        textTransform: 'uppercase'
    }
    
})

export default globalStyles