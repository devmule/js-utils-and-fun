export function sigmoid(x) {
	return 1 / (1 + Math.exp(-x));
}

export function sigmoidDerivative(x) {
	let fx = sigmoid(x);
	return fx * (1 - fx);
}
