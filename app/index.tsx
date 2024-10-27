import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { initializeDatabase, getAllusers, clearAllUsers, getUser, logInUser} from '../components/localserver'


const index = () => {
    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');
    const [showAllUsers, setShowAllUsers] = useState<boolean>(false);
    const [allUsers, setAllUsers] = useState<any>([]);
    let Users

    useEffect(() => {
        initializeDatabase();
    }, []);

    const goToRegister = async() => {
        try {
            router.navigate('/register');
        }
        catch(error) {
            console.log(error)
        }
    }


    const fetchAllUsers = async() => {
        setShowAllUsers(true);
        try {
            const users = await getAllusers();
            setAllUsers(users);
            console.log(users);
        }
        catch(error) {
            console.log('Error fetching all users:', error);
        }
    }


    const deleteAllUsers = async() => {
        try {
            const clear = clearAllUsers();
            console.log(clear);
        }
        catch(error) {
            console.log('error deleting all users:', error)
        }
    }

    const hideAlluser = () => {
        setShowAllUsers(false);
    }

    const logIN = async() => {
        if(username.trim() === '' || password.trim() === '') {
            alert('username and password cannot be empty!')
            return;
        }
        try {
            const checkUser = await getUser(username,password);
            if(checkUser) {
                const saveUser = await logInUser(checkUser.id,username)
                alert(saveUser);
                router.replace('/profile');
            }
            else {
                alert('incorrect username or password!');
                return;
            }
        }
        catch(error) {
            alert(`error logging in user: ${error}`)
        } 
    }
    

//redering all users
    if(showAllUsers) {
        Users = <View style={{marginTop:20}}>
                    <Text> All Users</Text>
                    <FlatList       
                        data={allUsers}
                        renderItem={({ item }) => <Text>username: {item.username}</Text>}
                        keyExtractor={(item) => item.id}    
                    />
                    <Pressable style={styles.button} onPress={hideAlluser}><Text style={{textAlign:'center'}}>Close</Text></Pressable>
                </View>    
    }
  
    

    return(
        <View style={styles.container}>
            <Text>Log In</Text>
            <TextInput value={username} onChangeText={text => {setUsername(text)}} placeholder="username" style={styles.logInInput}/>
            <TextInput value={password} onChangeText={text => {setPassword(text)}} placeholder="password" style={styles.logInInput}/>
            <Pressable style={styles.button} onPress={logIN}><Text style={{textAlign:'center'}}>Login</Text></Pressable>
            <Pressable style={styles.button} onPress={goToRegister}><Text style={{textAlign:'center'}} >Register</Text></Pressable>
            <Pressable style={styles.button} onPress={fetchAllUsers}><Text style={{textAlign:'center'}}>Get All Accounts</Text></Pressable>
            <Pressable style={styles.button} onPress={deleteAllUsers}><Text style={{textAlign:'center'}}>Clear All Users</Text></Pressable>
            {Users}
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

export default index;