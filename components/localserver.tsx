import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('users.db');

export const initializeDatabase = () => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          password TEXT NOT NULL UNIQUE
        );`,
        [],
        () => { console.log("Users table created successfully"); },
        (_, error) => { console.error("Error creating users table:", error); return true}
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS currentuser(id INTERGER NOT NULL, username TEXT NOT NULL);',
        [],
        () => { console.log("CurrentUser table created successfully"); },
        (_, error) => { console.error("Error creating currentuser table:", error); return true}
      );
    });
  };


//USERS TABLE

//REGISTER Process
// validate
export const validate = (username:string): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM users WHERE username=?', 
                [username],
                (_,result) => { resolve(result.rows.item(0))},
                (_,error) => {reject(`Error on validating user ${error}`); return true}
            )
        })
    })
}
// register
export const getRegister = (username:any,password:any): Promise<any> => {
    return new Promise((resolve,reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO users(username,password) VALUES(?,?);',[username, password],
                (_,result) => { resolve(`${username} successfully registered`) },
                (_,error) => {reject(`Error regitering user ${error}`); return true}
            )
        })
    })
}

//--------------------------------------------------------------------------

//Login
export const getUser = (username:string, password:string): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE username=? AND password=?;', [username,password],
        (_,result) => {console.log(result.rows.item(0)); resolve(result.rows.item(0))},
        (_,error) => {reject(`Error getting users ${error}`); return true}
      )
    })
  })
}

//Save user info
export const logInUser = (id:number,username:string): Promise<any> => {
  return new Promise((resolve,reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO currentuser (id,username) VALUES(?,?);', [id,username],
        (_,result) => {resolve('Log in successfuly');},
        (_,error) => {reject(`Error Logging-in user ${error}`); return true}
      )
    })
  })
}

//get user info
export const getUserInfo = (): Promise<any> => {
  return new Promise((resolve,reject)=> 
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM currentuser;',[],
        (_,result) => {resolve(result.rows.item(0))},
        (_,error) => {reject(`error getting user info ${error}`); return true}
      )
    })
  )
}

//Clear user info
export const logOutUser = () => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM currentuser;',[],
      () => {console.log('log out successfully')},
      (_,error) => {console.log('Error Loggin-out user', error); return true}
    )
  })
}

//--------------------------------------------------------------------------

// Get all User
export const getAllusers = (): Promise<any> => {
  return new Promise((resolve,reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users;', [],
        (_,result) => { resolve(result.rows._array)},
        (_,error) => {reject(`Error fetching all users: ${error}`); return true}
      )
    })
  })
}

// DELETE ALL USERS
export const clearAllUsers = () => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM users;', [],
      () => {console.log('Successfully delete all of the users')},
      (_,error) => {console.log('Error deleting all users;', error); return true}
    )
  })
}