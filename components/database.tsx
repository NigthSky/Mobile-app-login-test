import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('users.db');

export const createTable = () => {

  // TABLES CREATION --------------------
  db.transaction(tx => {
    // USER TABLE
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL);',
      [],
      () => { console.log('Table users created successfully!'); },
      (_, error) => { console.error('Error creating table:', error); return true }
    );

    // CURRENT USER TABLE
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS currentuser (id INT NOT NULL, username TEXT NOT NULL );',
      [],
      () => {console.log('Table currentuser created successfully!'); },
      (_,error) => { console.error('Error creating table:', error); return true }
    );

    //ADDED USER TABLE
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS addeduser (username TEXT NOT NULL, password TEXT NOT NULL);',
      [],
      () => {console.log('Table addeduser created successfully!'); },
      (_,error) => { console.error('Error creating table:', error); return true }
    );
  });
};
//--------------------------------------------------------------------------------



// CURRENT USER TABLE ------------------------------------------------------------
// SAVE USER INFO ON LOG IN
export const currentUserInfo = (username:string, id:any): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO currentuser (id, username) VALUES(?,?);`,
        [id,username],
        (_,result) => {console.log(`Current user added: `,result.rowsAffected)},
        (_,error) => {console.log('Error checking current user',error); return true;}
      );
    });
  });
};

// FETCH CURRENT USER INFO
export const getCurrentUser = (): Promise<any> => {
  return new Promise((resolve,reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM currentuser;',
        [],
        (_,result) => {
          console.log('inforamtion get on current user'); 
          console.log(result.rows.item(0));
          resolve(result.rows.item(0));
        }, 
        (_,error) => {console.log('Error getting currentuser',error); return true;}
      );
    })
  })
}

// CLEAR USER INFO ON LOG OUT
export const removeCurrentUser = (username:string): Promise<any> => {
  return new Promise((resolve,reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM currentuser;',
        [username],
        (_,result) => {
          console.log('Currentuser logging out Successfully'); 
        }, 
        (_,error) => {console.log('Error logging out Currentuser',error); return true;}
      );
    })
  })
}

//-----------------------------------------------------------------------------------------------


// USERS TABLE-----------------------------------------------------------------------------------
// FETCH AND VERFIY USER
export const getUser = (username: string, password:string): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT *  FROM users WHERE username = ? AND password = ?;',
        [username, password],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(result.rows.item(0));
          } else {
            resolve('Invalid username or password');
          }
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

// CHECK USER IF EXISTING
export const Validation = (username:string): Promise<any> => {
    return new Promise((resolve,reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM users WHERE username=?;`,
                [username],
                (_,result) => {
                    // console.log(result.rows.item(0));
                    if(result.rows.length > 0) {
                        resolve(result.rows.item(0));
                    } else {
                        resolve(false);
                    }
                },   
                (_,error) => {
                    reject(error);
                    return true;
                }
            )
        });
    });
}

// REGISTER USER ON THE LOCAL DATABASE
export const userRegister = (username:string, password:string): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx =>{
            tx.executeSql(
                'INSERT INTO users (username, password) VALUES (?, ?);',
                [username,password],
                (_, result) => {
                if (result.rowsAffected > 0) {
                    console.log(`Users added: `,result.rowsAffected);
                    resolve('User Added Successfully');
                } 
                },
                (_, error) => {
                reject(error);
                return true;
                }
            )
        });
    });
}

// FETCH ALL USERS
export const getAllusers = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM users;`,
            [],
            (_,result) => {
                console.log('all users was fecth:', result.rows._array);
                resolve(result.rows._array);
            },
            (_,error) => {
                console.log("Error Fetching users:", error);
                reject(error)
                return true;
            }
            )
        })
    })
}

//--------------------------------------------------------------------------

// ADDED USER TABLE (FOR SYNC) --------------------------------------------------
// ADD NEW REGISTER USER
export const userLocalAdded = (username:string, password:string): Promise<any> => {
  return new Promise((resolve,reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO addeduser (username,password) VALUES (?,?);', [username, password],
      (_,result) => { resolve('added')},
      (_,error) => {
        console.log("Error Fetching users:", error);
        reject(error)
        return true;
      }
      )
    })
  });
}

// GET ALL ADDED USER
export const getAddedUsers =  (): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM addeduser;',[],
        (_,result) => {resolve(result.rows._array)},
        (_,error) => {reject(error); return true}
      )
    })
  })
}

// CLEAR ADDED TABLE
export const removeAddedUser = ():Promise<any> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM addeduser;',[],
        (_,result) => {resolve('Deleted')},
        (_,error) => {reject(error); return true}
      )
    })
  })
}

//---------------------------------------------------------------------------



  