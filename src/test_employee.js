const Person = require("./person");
const Employee = require("./employee.js");
const p1 = new Person("Amy", 20);
const p2 = new Employee('David',50,"c001");

console.log(p1);
console.log(p2);
console.log(JSON.stringify(p1));
console.log(JSON.stringify(p2));

