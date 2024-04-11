import { Database } from "./common/objectStorage";

const backEndUrl = "http://10.89.2.170:8001";
export function updateDatabase(callback: Function) {
    Database.clear();
    fetch(backEndUrl + "/api/getDatabase", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstParam: "yourValue",
            secondParam: "yourOtherValue",
        }),
    }).then((data) => {
        console.log(
            data.text().then((t) => {
                Database.fromJSON(JSON.parse(t));
                callback();
            })
        );
    });
}

export function parsePackage(filePath: string): Promise<Response> {
    return fetch(backEndUrl + "/api/parsePackage", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            folderPath: filePath,
        }),
    });
}

export function register(
    userName: string,
    md5Password: string
): Promise<Response> {
    return fetch(backEndUrl + "/api/createUser", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: userName,
            password: md5Password,
            email: "not implemented",
            name: "not implemented"
        }),
    });
}

export function login(userName: string, md5Password: string){
    return fetch(backEndUrl + "/api/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: userName,
            password: md5Password
        }),
    });
}
