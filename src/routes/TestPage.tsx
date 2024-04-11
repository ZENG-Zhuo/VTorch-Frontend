import { Database } from "../common/objectStorage";
const backEndUrl = "http://localhost:8001";

function testFunc() {
   
}

function testGoogle() {
    fetch("http://localhost:8001/api/getDatabase", {
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
                console.log(Database.packages);
            })
        );
    });
}

export default function TestPage() {
    return (
        <div id="test-page">
            <h1 onClick={testGoogle}>Oops!</h1>
            <button onClick={testFunc} />
        </div>
    );
}
