
var g_canvas = null;
var g_lightspeed_input = null;
var g_ctx = null;

var g_interval = null;
var g_anim_param = 0.0;
const intervalMs = 40;

function start_anim() {
	if(g_interval) {clearInterval(g_interval); g_interval = null;}
	g_anim_param = 0.0;
	
	g_interval = setInterval(function() {
		const maxLightspeed = 0.95;
		let lightspeed = (-1.0 * Math.cos(g_anim_param) + 1) * maxLightspeed * 0.5;
		update2(g_ctx, lightspeed);
		g_anim_param += intervalMs * 0.001;
	}, intervalMs);
}

function stop_anim() {
	if(g_interval) {clearInterval(g_interval); g_interval = null;}
	g_anim_param = 0.0;
}

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
	const step = 32;
	
	for(var y = -h/2; y < h/2; y += step) {
		for(var x = -w/2; x < w/2; x += step) {
			let vec = [x, y];
			let transformed = lorentz_transform_tx(vec, lightspeed);
			put_point(ctx, mapToCanvas(transformed));
		}
	}
}

function mapToCanvas(vec) {
	const w = g_canvas.width;
	const h = g_canvas.height;
	let middle = [w/2, h/2];
	const x = vec[1] + middle[0];
	const y = middle[1] - vec[0];
	return [x, y];
}

function mapFromCanvas(vec) {
	const w = g_canvas.width;
	const h = g_canvas.height;
	let middle = [w/2, h/2];
	return [middle[1] - vec[1], vec[0] - middle[0]];
}

function drawMappedPoint(ctx, vec, lightspeed0, lightspeed1) {
	let transformed0 = lorentz_transform_tx(vec, lightspeed0);
	let transformed1 = lorentz_transform_tx(vec, lightspeed1);
	let p0 = mapToCanvas(transformed0);
	let p1 = mapToCanvas(transformed1);
	ctx.beginPath();
	ctx.moveTo(p0[0], p0[1]);
	ctx.lineTo(p1[0], p1[1]);
	ctx.stroke();
	
	ctx.strokeStyle = "green";
	put_point(ctx, mapToCanvas(transformed0));
	ctx.strokeStyle = "red";
	put_point(ctx, mapToCanvas(transformed1));
	ctx.strokeStyle = "gray";
}

function drawLine(ctx, x, lightspeed) {
	const step = 30;
	const w = g_canvas.width;
	const h = g_canvas.height;
	let middle = [w/2, h/2];
	for(var y = 0; y < h; y += step*0.25) {
		const xx = middle[1] + x;
		let vec = mapFromCanvas([xx, y]);
		drawMappedPoint(ctx, vec, 0.0, lightspeed);
	}
}

function update() {
	const lightspeed = parseFloat(g_lightspeed_input.value);
	let ctx = g_ctx;
	update2(ctx, lightspeed);
}

function update2(ctx, lightspeed) {
	const step = 30;
	const w = g_canvas.width;
	const h = g_canvas.height;
	
	clearCanvas(ctx);
	drawCross(ctx);
	
	ctx.strokeStyle = "gray";
	drawGrid(ctx, 0.0);
	ctx.strokeStyle = "black";
	drawGrid(ctx, lightspeed);
	drawLine(ctx, step * 4, lightspeed);
}

function put_point(ctx, vec) {	
	const size = 3;
	const x = vec[0];
	const y = vec[1];
	
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
	transformed[0] *= c;
	return transformed;
}
