const Person = require("./person");

class Employee extends Person {
    constructor(name = "noname", age = 20, id = "") {
        super(name, age);
        this.id = id;
    }
    toJSON() {
        const { name, age, employee_id } = this;
        return { name, age, employee_id };
    }
}
module.exports = Employee;
