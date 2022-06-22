const { f1, f2 } = require("./func02");
const { f1: a1, f2: a2 } = require("./func02");

console.log(f1(5));
console.log(a2(5));
console.log(a1 === f1);
//這邊拿的a1跟f1是同樣的參照 所以在log上會顯示為true
