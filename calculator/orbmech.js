
var _ORBMECH_CONSTANTS = {
	g_std: 9.80665,
	G: 6.67430e-11,
	M_earth: 5.972e24
};

if(typeof(calculators)==="undefined")
	calculators = {};

calculators.TsoilkovskyCalculator = {
	title: "Tsoilkovsky Delta-V Calculator",
	inputs: {
		Isp: {value: 200}, // in seconds
		M_start: {value: 10},
		M_final: {value: 1},
	},
	outputs: {
		delta_v: {}
	},
	calc: function(inp) {
		var out = {};
		out.delta_v = inp.Isp * _ORBMECH_CONSTANTS.g_std * Math.log(inp.M_start / inp.M_final);
		return out;
	}
};

calculators.gravityAccCalculator = {
	title: "Gravitational Acceleration Calculator",
	inputs: {
		M: {value: _ORBMECH_CONSTANTS.M_earth},
		d: {value: 6371000}
	},
	outputs: {
		g: {}
	},
	calc: function(inp) {
		var out = {};
		out.g = _ORBMECH_CONSTANTS.G * inp.M / (inp.d * inp.d);
		return out;
	}
};