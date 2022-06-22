const Person = require('./person');
const p1 = new Person('Amy',20);
const p2 = new Person(40);

console.log(p1);
console.log(p2);
console.log(JSON.stringify(p1));
console.log(""+p2);
