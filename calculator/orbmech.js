
var _ORBMECH_CONSTANTS = {
	g_std: 9.80665,
	G: 6.67430e-11,
	M_earth: 5.972e24
};

var _STD_GRAV_PARAMS = {
	earth: {name: "Earth", value: 3.986004418e14},
	moon: {name: "Moon", value: 4.9048695e12},
	sun: {name: "Sun", value: 1.32712440018e20},
	mars: {name: "Mars", value: 4.282837e13},
	kerbin: {name: "Kerbin", value: 3.5316e12},
	mun: {name: "Mun", value: 6.5138398e10},
	kerbol: {name: "Kerbol", value: 1.1723328e18}
};

var _CEL_BODY_RADIUS = {
	earth: {name: "Earth", value: 6371e3},
	earth_iss: {name: "Earth - ISS", value: 6771e3},
	earth_geo: {name: "Earth - GEO", value: 42164e3},
	sun: {name: "Sun", value: 695700e3},
	moon: {name: "Moon", value: 1737.4e3},
	kerbin: {name: "Kerbin", value: 600e3},
	mun: {name: "Mun", value: 200e3}
};

var _CEL_BODY_DISTANCE = {
	mun: {name: "Mun", value: 12e6}
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
		r: {value: 6371000, options: _CEL_BODY_RADIUS}
	},
	outputs: {
		g: {}
	},
	calc: function(inp) {
		var out = {};
		out.g = _ORBMECH_CONSTANTS.G * inp.M / (inp.r * inp.r);
		return out;
	}
};

calculators.circularOrbitVelocityCalculator = {
	title: "Circular Orbit Velocity",
	inputs: {
		mu: {value: _ORBMECH_CONSTANTS.M_earth * _ORBMECH_CONSTANTS.G, label: "μ (GM)", options: _STD_GRAV_PARAMS},
		r: {value: 6371000, options: _CEL_BODY_RADIUS}
	},
	outputs: {
		v_orb: {},
		v_esc: {}
	},
	calc: function(inp) {
		var out = {};
		out.v_orb = Math.sqrt(inp.mu  / inp.r);
		out.v_esc = Math.sqrt(2) * out.v_orb;
		return out;
	}
};

calculators.orbitDeltaV = {
	title: "delta-v",
	inputs: {
		mu: {value: _ORBMECH_CONSTANTS.M_earth * _ORBMECH_CONSTANTS.G, label: "μ (GM)", options: _STD_GRAV_PARAMS},
		r1: {value: 6371000, options: _CEL_BODY_RADIUS},
		v1: {value: 0},
		r2: {value: 6771000, options: _CEL_BODY_RADIUS},
		v2: {value: 0}
	},
	outputs: {
		Epot_1: {},
		Epot_2: {},
		Ediff: {},
		deltaV: {}
	},
	calc: function(inp) {
		var out = {};
		// specific orbital energy
		out.Epot_1 = inp.v1*inp.v1/2-inp.mu/inp.r1;
		out.Epot_2 = inp.v2*inp.v2/2-inp.mu/inp.r2;
		out.Ediff = out.Epot_2 - out.Epot_1;
		out.deltaV = Math.sqrt(2*out.Ediff);
		return out;
	}
};

calculators.fuelMassForPayloadWithDeltaVCost = {
	title: "Fuel mass for payload with Delta-V cost",
	inputs: {
		deltaV: {value: 11.2e3},
		finalMass: {value: 1e3},
		effectiveExhaustVel: {value: 3e3}
	},
	outputs: {
		fuelMass: {},
		totalMass: {},
		totalMassToFinalMassRatio: {}
	},
	calc: function(inp) {
		var out = {};
		out.totalMass = inp.finalMass * Math.pow(Math.E, inp.deltaV / inp.effectiveExhaustVel);
		out.fuelMass = out.totalMass - inp.finalMass;
		out.totalMassToFinalMassRatio = out.totalMass / inp.finalMass;
		return out;
	}
};


calculators.hohmann = {
	title: "hohmann",
	inputs: {
		mu: {value: _STD_GRAV_PARAMS.kerbin.value, label: "μ (GM)", options: _STD_GRAV_PARAMS},
		r0: {value: _CEL_BODY_RADIUS.kerbin.value + 100e3, options: _CEL_BODY_RADIUS},
		//v0: {value: 0},
		r1: {value: _CEL_BODY_DISTANCE.mun.value, options: _CEL_BODY_DISTANCE},
	},
	outputs: {
		v1: {},
		dv1: {},
		v2: {},
		dv2: {},
		deltaV: {},
		t1: {}
	},
	
	/*
	getMeanAnomaly: function(trueAnomaly, eccentricity) {
		var f = trueAnomaly;
		var cosF = Math.cos(f);
		var sinF = Math.sin(f);
		var e = eccentricity;
		var e2 = e * e;
		var atanArg1 = -1.0*Math.sqrt(1.0 - e2) * sinF;
		var atanArg2 = -1.0 * e - cosF;
		var M = Math.atan2(atanArg1, atanArg2) +
			Math.PI - e * ((Math.sqrt(1.0 - e2) * sinF) / (1 + e * cosF));
		return M;
	},*/
	
	calc: function(inp) {
		var out = {};
		var v0 = Math.sqrt(inp.mu / inp.r0); // circular orbit vel.
		var v1 = Math.sqrt(2*inp.mu * (1/inp.r0 - 1/(inp.r0 + inp.r1)));
		var v1a = Math.sqrt(2*inp.mu * (1/inp.r1 - 1/(inp.r0 + inp.r1)));
		var dv1 = v1 - v0;
		var v2 = Math.sqrt(2*inp.mu * (1/inp.r1 - 1/(inp.r1 + inp.r1)));
		var dv2 = v2 - v1a;
		out.v1 = v1;
		out.dv1 = dv1;
		out.v2 = v2;
		out.dv2 = dv2;
		out.deltaV = out.dv1 + out.dv2;
		out.t1 = Math.PI * Math.sqrt(Math.pow(inp.r0+inp.r1, 3)/(8*inp.mu));
		return out;
	}
};