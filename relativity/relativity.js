
var g_canvas = null;
var g_lightspeed_input = null;
var g_ctx = null;

function init() {
	g_lightspeed_input = document.getElementById("lightspeed");
	
	let canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	document.body.appendChild(canvas);
	g_canvas = canvas;
	g_ctx = g_canvas.getContext("2d");
	update();
}

function clearCanvas(ctx) {
	const w = g_canvas.width;
	const h = g_canvas.height;
	
	ctx.fillStyle = "white";
	ctx.fillRect(0,0, w, h);
}


function drawCross(ctx) {
	const w = g_canvas.width;
	const h = g_canvas.height;
	
	ctx.strokeStyle = "black";
	
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(w, h);
	ctx.moveTo(0, h);
	ctx.lineTo(w, 0);
	ctx.stroke();
	
}

function drawGrid(ctx, lightspeed) {
	const w = g_canvas.width;
	const h = g_canvas.height;
	const step = 30;
	
	let middle = [w/2, h/2];
	
	for(var y = 0; y < h; y += step) {
		for(var x = 0; x < w; x += step) {
			let vec = [y-middle[1], x - middle[0]];
			let transformed = lorentz_transform_tx(vec, lightspeed);
			put_point(ctx, transformed);
		}
	}
}

function drawLine(ctx, x) {
	const step = 30;
	const w = g_canvas.width;
	const h = g_canvas.height;
	let middle = [w/2, h/2];
	for(var y = 0; y < h; y += step*0.1) {
		const xx = middle[1] + x;
		let vec = [y - middle[1], xx - middle[0]];
		let transformed = lorentz_transform_tx(vec, parseFloat(g_lightspeed_input.value));
		put_point(ctx, transformed);
	}
}

function update() {
	const step = 30;
	const w = g_canvas.width;
	const h = g_canvas.height;
	let ctx = g_ctx;
	
	clearCanvas(ctx);
	drawCross(ctx);
	
	const lightspeed = parseFloat(g_lightspeed_input.value);
	
	ctx.strokeStyle = "gray";
	drawGrid(ctx, 0.0);
	ctx.strokeStyle = "black";
	drawGrid(ctx, lightspeed);
	
	ctx.strokeStyle = "green";
	drawLine(ctx, step);
	ctx.strokeStyle = "red";
	drawLine(ctx, step);
	ctx.strokeStyle = "black";
}

function put_point(ctx, vec) {
	const w = g_canvas.width;
	const h = g_canvas.height;
	let middle = [w/2, h/2];
	
	const size = 3;
	const x = vec[1] + middle[0];
	const y = vec[0] * c + middle[1];
	
	ctx.beginPath();
	ctx.moveTo(x-size, y-size);
	ctx.lineTo(x+size, y+size);
	ctx.moveTo(x-size, y+size);
	ctx.lineTo(x+size, y-size);
	ctx.stroke();
}

const c = 3.0e8;	

function lorentz_transform_tx(vec, lightspeed) {
	const v = lightspeed * c;
	let gamma = 1.0 / Math.sqrt(1.0 - lightspeed*lightspeed);
	const t = vec[0] / c;
	const x = vec[1];
	let transformed = [
		gamma * (t - (v * x)/(c*c)), // t'
		gamma * (x - v * t) // x'
	];
	return transformed;
}
