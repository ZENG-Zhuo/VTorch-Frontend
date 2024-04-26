import { UDBData } from "./common/UDBTypes";
import { CodeGenInfo } from "./common/codeGenTypes";
import { DatasetInfo } from "./common/datasetTypes";
import { Database } from "./common/objectStorage";

const backEndUrl = "http://10.89.2.170:8001";
// const backEndUrl = "http://192.168.8.17:8001";
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

export function setDatasetInfo(
    name: string,
    datasetInfo: DatasetInfo,
    callback?: Function
) {
    fetch(backEndUrl + "/api/setDatasetInfo", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            datasetInfo: JSON.stringify(datasetInfo.toJSON()),
        }),
    }).then((_) => {
        console.log("set dataset sucess");
        if (callback) callback();
    });
}

export function getDatasetInfos(
    setDatasetInfos: (datasets: Map<string, DatasetInfo>) => void
) {
    fetch(backEndUrl + "/api/getDatasetInfos", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    }).then((data) => {
        data.json().then((data) => {
            const datasetInfos: Map<string, DatasetInfo> = new Map(data);
            setDatasetInfos(datasetInfos);
        });
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
            name: "not implemented",
        }),
    });
}

export function login(userName: string, md5Password: string) {
    return fetch(backEndUrl + "/api/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: userName,
            password: md5Password,
        }),
    });
}

export function addUDB(data: UDBData): Promise<Response> {
    return fetch(backEndUrl + "/api/addUDB", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function genCode(data: CodeGenInfo): Promise<Response>{
    return fetch(backEndUrl + "/api/generateCode", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export function getModules(): Promise<Response>{
    return fetch(backEndUrl + "/api/getReadyGraphs", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
}

export function getAllModules(): Promise<Response>{
    return fetch(backEndUrl + "/api/getAllGraphs", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
}