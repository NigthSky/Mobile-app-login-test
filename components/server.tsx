import axios from 'axios';

export const addToSever = (user:any): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios
            .post('http://192.168.0.63:9000/test/addnewuser', user)
            .then(res => {
                        let data = res.data;
                        console.log(res.data)
                        resolve(data);
                    })
            .catch(e => reject(e));
    })
}

export const getServerUsers = (): Promise<any> => {
    return new Promise((resolve,reject) => {
        axios
            .post('http://192.168.0.63:9000/test/users')
            .then (res => {
                    let data = res.data;
                    console.log(res.data);
                    resolve(data);
                })
            .catch(e => reject(e));
    })
}