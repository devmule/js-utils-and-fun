import Matrix from "./Matrix.js";
import Ratio from "./Ratio.js";

function test(value, expected) {
	if (value === expected) console.log('DONE');
	else console.error('ERROR');
}

let a = new Ratio(11, 20);
let b = new Ratio(1, 2);

test(2 + b, 2.5);
test(a.eq(b), false);
test(a.lt(b), false);
test(a.lte(b), false);
test(a.gt(b), true);
test(a.gte(b), true);
