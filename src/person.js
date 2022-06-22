class Person {
    gender = "male";
    constructor(name = "noname", age = 20) {
        this.name = name;
        this.age = age;
    }
    toJSON() {
        return {
            name: this.name,
            age: this.age,
            gender: this.gender,
            data: "aabbcc",
        };
    }
    toString() {
        return JSON.stringify(this, null, 4);
    }
}
module.exports = Person;
