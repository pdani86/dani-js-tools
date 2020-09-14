
_THERMODYN_CONSTANTS = {
    R: 8.31446261815324,
	StefanBoltzmann: 5.670373e-8
}

if(typeof(calculators)==="undefined")
	calculators = {};

calculators.adiabaticCalculator = {
	title: "Adiabatic Process Calculator",
	inputs: {
		f: {value: 5},
		p0: {value: 100000},
		V0: {value: 1},
		T0: {value: 300},
		V1: {value: 0.5}
	},
	outputs: {
		p1: {},
		T1: {},
		n: {},
		W: {}
	},
	calc: function(inp) {
		var out = {};
		// k = (f+2)/f
		// adiabatic
		//     P*V^k = const
		// reversible:
		//     P^(1-k)*T^k = const
		//     V*T^(f/2) = const
		//     T*V^(k-1) = const
		// Work:
		//     (P2*V2-P1*V1)/(1-k)
		var k = (inp.f+2)/(inp.f);
		out.p1 = inp.p0 * Math.pow(inp.V0, k) / Math.pow(inp.V1, k);
		out.T1 = inp.T0 * Math.pow(inp.V0, k-1) / Math.pow(inp.V1, k-1);
		/*var _K = inp.p0 * Math.pow(inp.V0, k);
		out.W = _K*(Math.pow(inp.V1, 1-k) - Math.pow(inp.V0, 1-k)) / (1-k);*/
		out.W = (out.p1*inp.V1 - inp.p0*inp.V0) / (1-k);
		out.n = inp.p0*inp.V0/(inp.T0*_THERMODYN_CONSTANTS.R);
		return out;
	}
};

calculators.isothermalCalculator = {
	title: "Isothermal Process Calculator",
	inputs: {
		f: {value: 5},
		p0: {value: 100000},
		V0: {value: 1},
		T0: {value: 300},
		V1: {value: 0.5}
	},
	outputs: {
		p1: {},
		n: {},
		W: {}
	},
	calc: function(inp) {
		var out = {};
		// k = (f+2)/f
		//var k = (inp.f+2)/(inp.f);
		out.n = inp.p0*inp.V0/(inp.T0*_THERMODYN_CONSTANTS.R);
		out.p1 = inp.p0 * inp.V0 / inp.V1;
		out.W = -1*out.n*_THERMODYN_CONSTANTS.R*inp.T0 * Math.log(inp.V1/inp.V0);
		return out;
	}
};

calculators.stefanBoltzmannCalculator = {
	title: "Black Body Radiation Calculator",
	inputs: {
		e: {value: 0.03},
		T: {value: 300},
		A: {value: 0.01},
		Ta: {value: 0}
	},
	outputs: {
		P: {}
	},
	calc: function(inp) {
		var out = {};
		out.P = inp.A * inp.e * _THERMODYN_CONSTANTS.StefanBoltzmann * 
		    (Math.pow(inp.T, 4) - Math.pow(inp.Ta, 4));
		return out;
	}
};