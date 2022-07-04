

var calculator_gui = new CalculatorGUI();

function createCalculatorList() {
	var container = document.createElement("div");
	var calc_list = document.createElement("select");
	container.appendChild(calc_list);
	for(var key in calculators) {
		var opt = document.createElement("option");
		opt.setAttribute("value",key);
		opt.innerText = key;
		calc_list.appendChild(opt);
	}
	return container;
}

function init() {
	document.body.appendChild(createCalculatorList());
	document.body.appendChild(calculator_gui.createGui(calculators.adiabaticCalculator));
	document.body.appendChild(calculator_gui.createGui(calculators.isothermalCalculator));
	document.body.appendChild(calculator_gui.createGui(calculators.stefanBoltzmannCalculator));
	document.body.appendChild(calculator_gui.createGui(calculators.TsoilkovskyCalculator));
	document.body.appendChild(calculator_gui.createGui(calculators.gravityAccCalculator));
	document.body.appendChild(calculator_gui.createGui(calculators.circularOrbitVelocityCalculator));
	document.body.appendChild(calculator_gui.createGui(calculators.orbitDeltaV));
	document.body.appendChild(calculator_gui.createGui(calculators.fuelMassForPayloadWithDeltaVCost));
	
	
}
	
