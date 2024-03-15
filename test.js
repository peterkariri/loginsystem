function showPerson(){
    console.log(`${name} was born ${2024-age}`);
}

showPerson("Albert",27)
showPerson("Victor",27)
showPerson(45,"jane")

const router={
    server:"node",
    protocol:"http",
    get:(incoming,outgoing)=>{
        console.log("receiving"+incoming);
        console.log("sending " + outgoing);
        showPerson("albert",22)
    }
}