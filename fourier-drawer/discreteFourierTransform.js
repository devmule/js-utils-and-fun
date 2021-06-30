/** получает путь из точек, возвращает список окружностей
 * @param {{x:number,y:number}[]} dots
 * @return {{r:number,i:number,freq:number,amp:number,phase:number}[]}
 * **/
export default function (dots) {
	let X = [];
	let N = dots.length;
	for (let k = 0; k < N; k++) {
		let r = 0, i = 0;
		for (let n = 0; n < N; n++) {
			
			let phi = (2 * Math.PI * k * n) / N;
			let r_n = Math.cos(phi);
			let i_n = -Math.sin(phi);
			
			r += dots[n].x * i_n - dots[n].y * r_n;
			i += dots[n].x * i_n + dots[n].y * r_n;
		}
		r /= N;
		i /= N;
		
		let freq = k;
		let amp = Math.sqrt(r * r + i * i);
		let phase = Math.atan2(i, r);
		X[k] = {r, i, freq, amp, phase};
	}
	return X;
}
