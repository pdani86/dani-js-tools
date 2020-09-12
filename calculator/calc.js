

var calculator_gui = new CalculatorGUI();

function init() {
	document.body.appendChild(calculator_gui.createGui(adiabaticCalculator));
	document.body.appendChild(calculator_gui.createGui(isothermalCalculator));
}
	
