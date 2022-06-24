function genObject() {
    return {
        name: "peter",
        age: 26,
    };
}

genObject.method01 = () => {
    console.log("method01");
};

const obj = genObject();
console.log(obj);
//{ name: 'peter', age: 26 }
genObject.method01();
//method01
console.log(genObject.constructor.name);
//Function
console.log(genObject.method01.constructor.name);
//Function
