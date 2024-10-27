import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { getRegister, validate} from '../components/localserver';
import { useState } from "react";


const register = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPass, setConfirmPass] = useState<string>('');


    const processRegister = async() => {
        if(username.trim() === '' || password.trim() === '') {
            alert('username and password cannot be empty!')
            return;
        }
        if(password !== confirmPass) {
            alert('password is not match!') 
                return;
        }
        try {
            const check = await validate(username);
            if(!check) {
                const reg = await getRegister(username,password);
                alert(reg);
                router.replace('/');
            } else {
                console.log('username already used!')
            }
        }
        catch(error) {
            console.log(error)
        }
    }

    return(
        <View style={styles.container}>
                <Text>Register</Text>
                <TextInput value={username} onChangeText={text => setUsername(text)} placeholder="username" style={styles.logInInput}/>
                <TextInput value={password} onChangeText={text => setPassword(text)} placeholder="password" style={styles.logInInput}/>
                <TextInput value={confirmPass} onChangeText={text => setConfirmPass(text)} placeholder="Confirm Password" style={styles.logInInput}/>
                <Pressable style={styles.button} onPress={processRegister}><Text style={{textAlign:'center'}}>Register</Text></Pressable>
        </View>
    );
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


export default register;