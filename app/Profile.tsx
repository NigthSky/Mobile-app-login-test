import { View , Text , StyleSheet, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { getCurrentUser, removeCurrentUser } from '../components/database'



export default function Profile(userData:any) {
    const [user, setUser] = useState<any>('');
    
    // GET USER INFO
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response);
            } catch(error) {
                console.log('Error fetching user data', error);
            }
        };

        fetchUserData();
    }, []);
    
    // LOGOUT USER
    const logOut = async() => {
        try {
            const remove = removeCurrentUser(user.username);
            remove;
            router.replace('/');
        }
        catch(error){
            console.log('Error on Loging out', error)
        }
    };


    return (
        
        <View style={styles.profileView}>
            <Text style={styles.text}> Hello {user.username}</Text>
            <Pressable onPress={logOut} style={styles.logOutButton}>
                <Text>
                    Log out
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    profileView: {
        flex: 1,
        justifyContent:'center',
    },
    text: {
        alignSelf:'center',
        marginBottom:10,
    },
    logOutButton: {
        padding:5,
        marginBottom: 5,
        borderRadius: 4,
        backgroundColor: '#3399ff',
        alignItems:'center',
      },
});