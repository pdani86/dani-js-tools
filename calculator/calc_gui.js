function CalculatorGUI() {

function createOptionList(inputElem, options) {
	var sel_elem = document.createElement("select");
	sel_elem.className = "calc-gui-value-selector input";
	for(var key in options) {
			var optDesc = options[key];
			var optElem = document.createElement("option");
			optElem.setAttribute("value", optDesc.value);
			optElem.innerText = optDesc.name;
			sel_elem.appendChild(optElem);
		}
	sel_elem.selectedIndex = -1;
	//sel_elem.addEventListener("change", function() {
		sel_elem.addEventListener("input", function() {
		if(sel_elem.selectedIndex == -1) return;
		inputElem.style.display = "";
		var selectedOption = sel_elem.selectedOptions[0];
		inputElem.value = parseFloat(selectedOption.value).toExponential(6);
		if(sel_elem.parentNode) sel_elem.parentNode.removeChild(sel_elem);
	});
	return sel_elem;
}

function createInput(inputId, inputDesc) {
	var div = document.createElement("div");
	var label = document.createElement("span");
	label.className = "label";
	var input = document.createElement("input");
	input.className = "input";
	input.setAttribute("type","text");
	var labelText;
	if("label" in inputDesc) labelText = inputDesc.label;
	else labelText = inputId;
	label.innerText = labelText+": ";
	if("value" in inputDesc) input.setAttribute("value", inputDesc.value);
	
	if("options" in inputDesc) {
		var options_elem = createOptionList(input, inputDesc.options);
		input.className = input.className + " has-value-list";
		input.data = {"optionsElem": options_elem};
		var onShowSelector = function(e) {
			input.data.optionsElem.selectedIndex = -1;
			input.parentNode.insertBefore(input.data.optionsElem, input);
			input.style.display = "none";
			//document.body.appendChild(input.data.optionsElem);
		};
		input.addEventListener("click", function(e) {if(!e.ctrlKey) return; onShowSelector(e);});
		input.addEventListener("dblclick", onShowSelector);
	}
	
	div.appendChild(label);
	div.appendChild(input);
	return [div, input];
}

this.createGui = function(calculatorDesc) {
	var inputs = calculatorDesc.inputs;
	var outputs = calculatorDesc.outputs;
	var calcFunc = calculatorDesc.calc;
	var container = document.createElement("div");
	container.className = "calculator-container";
	var input_container = document.createElement("div");
	var output_container = document.createElement("div");
	var footer_container = document.createElement("div");
	if("title" in calculatorDesc) {
		var title_container = document.createElement("div");
		title_container.innerText = calculatorDesc.title;
		title_container.appendChild(document.createElement("hr"));
		container.appendChild(title_container);
	}
	container.appendChild(input_container);
	container.appendChild(document.createElement("hr"));
	container.appendChild(output_container);
	container.appendChild(footer_container);
	var inputMap = {};
	for(var key in inputs) {
		var newInput = createInput(key, inputs[key]);
		inputMap[key] = newInput[1];
		input_container.appendChild(newInput[0]);
	}
	var outputMap = {};
	for(var key in outputs) {
		var newOutput = createInput(key, outputs[key])
		newOutput[1].setAttribute("readonly", "readonly");
		outputMap[key] = newOutput[1];
		output_container.appendChild(newOutput[0]);
	}
	
	var calcBtn = document.createElement("input");
	calcBtn.setAttribute("type", "button");
	calcBtn.setAttribute("value", "Calc");
	calcBtn.onclick = function() {
		var inputValMap = {};
		for(var key in inputs) {
			inputValMap[key] = parseFloat(inputMap[key].value);
		}
		var result = calcFunc(inputValMap);
		for(var key in result) {
			if(key in outputMap) {
				outputMap[key].value = result[key].toExponential(6);
			}
		}
	};
	footer_container.appendChild(calcBtn);
	var resetBtn = document.createElement("input");
	resetBtn.setAttribute("type", "button");
	resetBtn.setAttribute("value", "Reset");
	resetBtn.onclick = function() {
		for(var key in inputMap) {
			if((key in inputs) && ("value" in inputs[key])) {
				inputMap[key].value = inputs[key].value;
			}
		}
		for(var key in outputMap) {
			outputMap[key].value = "";
		}
	};
	footer_container.appendChild(resetBtn);
	
	return container;
}

}
