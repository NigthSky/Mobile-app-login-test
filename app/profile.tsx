import { router } from "expo-router";
import { Pressable, Text, View, StyleSheet } from "react-native";
import {logOutUser, getUserInfo} from '../components/localserver';
import { useEffect, useState } from "react";


const profile = () => {
    const [currUser, setCurrUser] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);

    const getinfo = async() => {
            try{
                setCurrUser(await getUserInfo());
                setIsLoading(false);
                return;
            }
            catch(error) {
                alert(error);
            }
        }
    getinfo();


    const logOut = async() => {
        try {
            const logOut = logOutUser();
            alert('log out succcessfully');
            router.replace('/');
        }
        catch(error) {
            alert(`error logging out user ${error}`)
        }
    }
    
    if(isLoading) {
        return(
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize:20}}>Loding...</Text>
            </View>
        )
    }
    return(
    <View style={styles.container}>
        <Text>Hello {currUser.username}</Text>
        <Pressable style={styles.button} onPress={logOut}><Text style={{textAlign:'center'}}>Log out</Text></Pressable>
    </View>
    )
}

const styles = StyleSheet.create( {
    container: {
        flex:1 ,
        marginTop:30,
        alignItems:'center',
        textAlign:'center'
    },
    logInInput: {
        borderWidth: 1,
        padding:5,
        width: '40%',
        margin:2,
        borderRadius:8,
    },
    button: {
        backgroundColor: '#5897EE',
        width: '40%',
        height:30,
        padding:5,
        marginTop: 3,
        borderRadius:3,
        justifyContent:'center',
    }
})

export default profile;