import axios from 'axios';
import * as SQLite from 'expo-sqlite/legacy';
import React, { useEffect, useState } from 'react';
import { getAllusers, getAddedUsers, removeAddedUser } from './database';
import { addToSever, getServerUsers } from './server';

const db = SQLite.openDatabase('users.db');

interface User {
    id: number;
    username: string;
    password: string;
}

interface added {
    username: string;
    password: string;
}

export const addLocaluser = async() => {
        const addedUsers = await getAddedUsers();
        const addToserver:  added[] = addedUsers;
        if(addedUsers.length > 0) {
            console.log('added to server:', addToserver);
            addToserver.forEach(user => {
                console.log('user :', user);
                const addtoserver = addToSever(user)

            });
            const remove = await removeAddedUser();
        }
        return;
}

export const synchronize = async() => {
        const responce = await getServerUsers();
        const serverUsers: User[] = responce;
        if(responce) {
            console.log('responce:',responce);
            db.transaction(tx => {
                tx.executeSql('DELETE FROM users;')
    
                serverUsers.forEach(user => {
                    tx.executeSql('INSERT INTO users (id,username,password) VALUES(?,?,?);', [user.id, user.username, user.password]);
                });
            });
            console.log('synchonizing users to the server success!'); 
            return('srychonizing users to the server success!');
        }
}
