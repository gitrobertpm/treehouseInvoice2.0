/*************************************************************
 * My Invoice App 2.0
 *
 *
 * Robert Manolis, Milwaukie OR, July 2016  :)
 *************************************************************/

"use strict";


var baseRate = document.getElementById("baseRate");
var name = document.getElementById("name");
var invoiceNumber = document.getElementById("invoiceNumber");
var totalTime = document.getElementById("totalTime");
var totalAmount = document.getElementById("totalAmount");
var invoiceBody = document.getElementById("invoiceBody");
var yourInfoInput = document.getElementsByClassName("yourInfoInput");
var invoiceRow = document.getElementsByClassName("invoiceRow");
var invoiceInput = document.getElementsByClassName("invoiceInput");
var invoiceInput2 = document.getElementsByClassName("invoiceInput2");
var itemMinutes = document.getElementsByClassName("itemMinutes");
var itemRate = document.getElementsByClassName("itemRate");
var itemAmount = document.getElementsByClassName("itemAmount");

var newRow = document.getElementById("newRow");
var rows = document.getElementById("rows");
var oneMore = document.getElementById("oneMore");
var clearAll = document.getElementById("clearAll");

var warningWrap = document.getElementById("warningWrap");
var trueClear = document.getElementById("trueClear");
var closeWarnng = document.getElementById("closeWarnng");

var instructions = document.getElementById("instructions");
var instructionsModal = document.getElementsByClassName("instructionsModal")[0];
var instructionClose = document.getElementById("instructionClose");

var csv = document.getElementById("csv");

var noLoSto = "Oops, your browser doesn't seem to have local staorage.  This app saves form data in local storage.  Try updating your browser.";
var baseRateWarning = "This input takes dollars per hour in positive numerical values.  Example: 3 or 42 or 420 or 3.14 ";
var baserRateReminder = "This App can't do any calculations until you enter your hourly rate above.  Just numerical digits please.  Example: 3 or 42 or 420 or 3.14";
var minuteWarning = "This input takes minutes in positive numerical values.  Example: 3 or 42 or 420 or 3.14 ";
var loStoReminder = "This invoice uses local storage to save your entires into this form until you hit clear.  You don't seem to have local storage, so some aspects of this App my not function properly and your data will not be saved.";
var rowInputReminder = "Please replace the '#' with a number between 1 and 42, then try again.";

var runningCount = 0;
var runningTime = 0;

totalTime.disabled = true;
totalAmount.disabled = true;

oneMore.disabled = true;


/* DOWNlOAD CSV */
csv.addEventListener("click", function() {
	
	var csvRows = [];

	for(var i=0, l=yourInfoInput.length - 2; i<l; ++i){
		csvRows.push(yourInfoInput[i].getAttribute("name") + ": " + yourInfoInput[i].value);
	}
	
	csvRows.push(" ");

	for(var j=0, m=invoiceInput.length; j<m; ++j){
		csvRows.push(invoiceInput[j].getAttribute("name") + ": " + invoiceInput[j].value);
		if ((j + 1) % 6 === 0) {
			csvRows.push(" ");
		}
	}
	
	csvRows.push(" ");

	for(var k=0, n=invoiceInput2.length; k<n; ++k){
		if (invoiceInput2[k].getAttribute("id") === "totalTime") {
		    csvRows.push(invoiceInput2[k].value.slice(0, 4) + " " + invoiceInput2[k].value.slice(5));
		} else if (invoiceInput2[k].getAttribute("id") === "totalAmount") {
		    csvRows.push(invoiceInput2[k].value.slice(0, 1) + invoiceInput2[k].value.slice(2));
		} else {
		    csvRows.push(invoiceInput2[k].value);
		    csvRows.push(" ");
		}
	}

	var csvString = csvRows.join("\r\n");
	csv.href = 'data:attachment/csv,' +  encodeURIComponent(csvString);
	csv.target = '_blank';
	
	csv.download = "invoice" + name.value + invoiceNumber.value + ".csv";
});





/* SAVE TO LOCAL STORAGE */
var saveThisData = function(el) {
		if(typeof(Storage) !== "undefined") {
			localStorage.setItem(el.getAttribute("id"), el.value);
		} else {
		    alert(noLoSto);
		}
};

/* PRINT TO PAGE FROM LOCAL STORAGE */
var setFromLocal = function(el) {
	
	// LOCAL STORAGE
	for (var ii = 0; ii < el.length; ii++) {
		
		// IF DATA IN STORAGE THEN LOAD FROM STORAGE ELSE NOTHING
		if(typeof(Storage) !== "undefined") {
			el[ii].value = localStorage.getItem(el[ii].getAttribute("id"));
		} else {
		    el[ii].value = "";
		}
	}
};


/* BLUR LISTENER FOR CALCULATING AND PRINTING TOTALS */
var addInputListener = function(el) {
	el.addEventListener("blur", function (){
		if (isNaN(this.value) || this.value < 0) {
			// ERROR FOR iNCORRECT INPUT
			alert(minuteWarning);
		}
		calkulator();
	});
};

/* SET ITEM AMOUNT VALUE */
var figureItemAmount = function(el) {
	el.addEventListener("input", function (){

		var amownt = this.value * (itemRate[this.getAttribute("id")[11]].value / 60);
		
		// ROUND TOTAL DUE
		var roundTotal = round(amownt, -1);
		itemAmount[this.getAttribute("id")[11]].value = roundTotal;
		itemAmount[this.getAttribute("id")[11]].blur = true;
		localStorage.setItem(itemAmount[this.getAttribute("id")[11]].getAttribute("id"), itemAmount[this.getAttribute("id")[11]].value);
	});
};

/* REFIGURE TOTAL AMOUNT */
var figureItemAmountForRate = function(el) {
	el.addEventListener("blur", function (){
		var amownt = (this.value / 60) * itemMinutes[this.getAttribute("id")[8]].value;
		
		// ROUND TOTAL DUE
		var roundTotal = round(amownt, -1);
		itemAmount[this.getAttribute("id")[8]].value = roundTotal;
		itemAmount[this.getAttribute("id")[8]].blur = true;
		localStorage.setItem(itemAmount[this.getAttribute("id")[8]].getAttribute("id"), itemAmount[this.getAttribute("id")[8]].value);
		
		calkulator();
	});
};



/* BLUR LISTENER FOR STORING DATA */
var addBlurListener = function(el) {
	el.addEventListener("blur", function () {
		var idee = this.getAttribute("id");
		var val = this.value;
		
		/* ERROR MESSAGE FOR INCORECT INPUT FOR HOURLY RATE */
		if (idee === "baseRate") {
			if (isNaN(this.value) || this.value < 0) {
				/* ERROR FOR iNCORRECT INPUT */
				alert(baseRateWarning);
				this.value = "";
			}
		}
		
		/* WARNING MESSAGE FOR EMPTY HOURLY RATE */
		if (idee === "itemMinutes") {
			if (baseRate.value === "" || baseRate.value === null) {
				alert(baserRateReminder);
			}
			
			if (isNaN(this.value) || this.value < 0) {
				/* ERROR FOR iNCORRECT INPUT */
				alert(baseRateWarning);
				this.value = "";
			}
		}
		
		saveThisData(this);
	});
};



/* ADD EVEN LISTENER TO PERSONAL INFO INPUTS */
for (var i = 0; i < yourInfoInput.length; i++) {
	addBlurListener(yourInfoInput[i]);
}

// SET/PULL TOTALS AND NOTES INTO/OUT OF LOCAL STORAGE
addBlurListener(invoiceInput2[0]);


/* HELPER FUNCTION FOR CREATING ELEMENTS */
var makeElement = function(el, klass, id, tipe, name, autoComp) {
	var elem = document.createElement(el);
	elem.setAttribute("class", klass);
	elem.setAttribute("id", id);
	elem.setAttribute("type", tipe);
	elem.setAttribute("name", name);
	elem.setAttribute("autocomplete", autoComp);
	return elem;
};

/* HELPER FUNCTION TO GENERATE DESIRED NUMBER OF NEW COMPLETE TABLE ROW(S) */
var makeRows = function() {
	var tr = makeElement("tr", "invoiceRow");
	var ip;
	for (var tdip = 1; tdip < 7; tdip++) {
		var td = makeElement("td");
		if (tdip === 1) {
			ip = makeElement("input", "invoiceInput", "itemDate", "text", "date", "off");
		} else if (tdip === 2) {
			ip = makeElement("input", "invoiceInput itemServiceType", "itemServiceType", "text", "service_type", "off");
		} else if (tdip === 3) {
			ip = makeElement("textarea", "invoiceInput itemDescription", "itemDescription", "text", "description", "off");	
		} else if (tdip === 4) {
			ip = makeElement("input", "invoiceInput itemMinutes", "itemMinutes", "text", "minutes", "off");
			addInputListener(ip);
			figureItemAmount(ip);
		} else if (tdip === 5) {
			ip = makeElement("input", "invoiceInput itemRate", "itemRate", "text", "rate", "off");
			ip.setAttribute("value", baseRate.value);
			figureItemAmountForRate(ip);
		} else if (tdip === 6) {
			ip = makeElement("input", "invoiceInput itemAmount", "itemAmount", "text", "amount", "off");
			ip.disabled = true;
		}
		addBlurListener(ip);
		td.appendChild(ip);
		tr.appendChild(td);
	}
	invoiceBody.appendChild(tr);
};



/* HELPER FUNCTION FOR CHANGING IDS FOR LOCAL STORAGE */
var prepareId = function(el) {
	// CREATE NEW ID
	var oldIdee = el.getAttribute("id");
	var classIndex = el.parentNode.parentNode.marker;
	var newIdee = oldIdee + classIndex;
	
	// SET NEW ID
	el.setAttribute("id", newIdee);
};

/* CHANGE ID OF INVOICE INPUTS TO INCLUDE TRAILING INDX OF PARENT'S PARENT SO EACH ID IS UNIQUE FOR PURPOSES OF LOAL STORAGE */
var changeId = function() {
	// STICK A MARKER ON INPUT'S PARENT'S PARENT
	for (var ir = 0; ir < invoiceRow.length; ir++) {
	    invoiceRow[ir].marker = ir; 
	}
	
	// CREATE NEW ID
	for (var ci = 0; ci < invoiceInput.length; ci++) {
		prepareId(invoiceInput[ci]);
	}
};

/* CHANGE IDS FOR ONE MORE ROW */
var oneRowId = function () {
	// STICK A MARKER ON NEW ROW INPUT'S PARENT'S PARENT
	invoiceRow[invoiceRow.length - 1].marker = invoiceRow.length - 1; 

	for (var ci = invoiceInput.length - 6; ci < invoiceInput.length; ci++) {
		prepareId(invoiceInput[ci]);
		
		if (baseRate.value !== "" || baseRate.value !== null) {
			if (invoiceInput[ci].getAttribute("id") === "itemRate" + invoiceRow[invoiceRow.length - 1].marker) {
				invoiceInput[ci].value = baseRate.value;
				saveThisData(invoiceInput[ci]);
			}
		}
	}
};



// HELPER FUNCTION FOR ROUNDING NUMBERS DOWN TO THE HUNDRETH DECIMAL PLACE
var round = function(num, places) {
	return Math.round(num * 100) / 100;
};

var getNewTotal = function(el) {
	runningCount = 0;
	for (var bill2 = 0; bill2 < el.length; bill2++) {
		runningCount += Number(el[bill2].value);
	}
	return runningCount;
};



// CALULATE AND UPDATE INVOICE TOTALS ON INPUT OF DATA INTO ANY CELL OF THE INVOICE COLUMN TITLED BILLABLE
var calkulator = function() {		
	var runTot = getNewTotal(itemMinutes);
	
	var newTotalAmount = getNewTotal(itemAmount);

	// GET RATE
	var myRate = baseRate.value;
	
	// CONVERT MINTUES TO HOURS
	var minToHours = runTot / 60;
	
	// HOURS * RATE = AMOUNT TO ADD
	var newTotal = Number(myRate) * Number(minToHours);
	
	var rountTotalAmount = round(newTotalAmount, -1);
	
	// ROUND TOTAL DUE
	var roundTotal = round(newTotal, -1);

	// PRINT TOTAL DUE
	totalAmount.value = "$\u00A0" + rountTotalAmount;

	
	// STORE DATA
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("totalDue", rountTotalAmount);

		// SET TOGGLE TO LOCAL STORAGE SO MACHINE KNOWS WHETHER TO LOAD WITH TOTAL VALUES OR NOT
		localStorage.setItem("rsToggle", true);
	}
	
	
	
	// ROUND TOTAL TIME
	var roundTime = round(minToHours, -1);
	
	// PRINT TOTAL TIME
	totalTime.value = roundTime + "\u00A0hours";
	
	// STORE DATA
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("totalTime", roundTime);

		// SET TOGGLE TO LOCAL STORAGE SO MACHINE KNOWS WHETHER TO LOAD WITH TOTAL VALUES OR NOT
		localStorage.setItem("rsToggle", true);
	}
};




window.onload = function() {
	
	
	/* SET/PULL MAIN PERSONAL AND BILLING INFO INTO/OUT OF LOCAL STORAGE */
	for (var i = 0; i < yourInfoInput.length; i++) {
		
		/* LOAD INPUTS FROM LOCAL STORAGE */
		if(typeof(Storage) !== "undefined") {
		    yourInfoInput[i].value = localStorage.getItem(yourInfoInput[i].getAttribute("id"));
		} else {
		    yourInfoInput[i].value = "";
		}
	}
	
	if(typeof(Storage) !== "undefined") {
		
		// SET INITIAL NUMBER OF ROWS BASED ON PREVIOUS STATE WITH LOCAL STORAGE
		for (var lsrn = 1; lsrn <= Number(localStorage.getItem("rowNumber")); lsrn++) {
			makeRows();
		}
		
		if (invoiceRow.length > 0) {
			newRow.disabled = true;
			oneMore.disabled = false;
		}
		
		// SET TOTALS
		var totalToggle = localStorage.getItem("rsToggle");
		
		if (totalToggle) {
			totalAmount.value = "$\u00A0" + localStorage.getItem("totalDue");
			totalTime.value = localStorage.getItem("totalTime") + "\u00A0hours";	
		} else {
			totalAmount.value = "$";
			totalTime.value = "hour(s)";
		}
		
		// CHANGE ID AND RESAVE TO LOCAL STORAGE IF OPENING OLD DATA FROM LOCAL STORAGE
		changeId();
		setFromLocal(invoiceInput);
		setFromLocal(invoiceInput2[0]);
	
		// SET STATE OF INPUT THAT CREATES ROWS
		var rsToggle = localStorage.getItem("rsToggle");
		
		if (rsToggle) {
			rows.value = localStorage.getItem("rowNumber");
			if (invoiceRow.length > 0) {
				rows.disabled = true;
			}
		}
		
		// LOAD SAVED NOTES IF THERE BE ANY, ARRRGH!  (HA! JUST THOUGHT I'D BE A PIRATE FOR A MINUTE.  :)  )
		invoiceInput2[0].value = localStorage.getItem(invoiceInput2[0].getAttribute("id"));
	} else {
		alert(loStoReminder);
		totalAmount.value = "$";
		totalTime.value = "hour(s)";
	}
	
	// MAKE SURE CALKULATOR DOESNT QUIT WORKING
	calkulator();
};




// HELPER FUNCTION TO MAKE ROWS
var makeSomeRowsYo = function() {
	if (rows.value < 1 || rows.value > 42 || isNaN(rows.value)) {
		// ERROR FOR iNCORRECT INPUT
		alert(rowInputReminder);
	} else {
		newRow.disabled = true;
		rows.disabled = true;
		oneMore.disabled = false;
		if(typeof(Storage) !== "undefined") {
		    localStorage.setItem("rowNumber", rows.value);
		}
		for (var rowi = 1; rowi <= rows.value; rowi++) {
			makeRows();
		}
	}	
	
	changeId();
	if (baseRate.value !== "" || baseRate.value !== null) {
		for (var i = 0; i < itemMinutes.length; i++) {
			itemRate[i].blur = true;
			localStorage.setItem(itemRate[i].getAttribute("id"), itemRate[i].value);
		}
	}	
};



// ADD ENTER BUTTON FUNCTIONALITY TO UNPUT
rows.addEventListener("keydown", function(e) {
	if(e.keyCode == 13){
		makeSomeRowsYo();
	}
});




// RESET LOCAL STORAGE FOR ROW NUMBER IMPUT AND RE-ENABLE CREATE ROWS BUTTON
rows.addEventListener("focus", function() {
	newRow.disabled = false;
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("rowNumber", rows.value);
	}
});



// CREATE ROWS AND SET NUMBER TO LOCAL STORAGE
newRow.addEventListener("click", function() {	
	makeSomeRowsYo();
});


oneMore.onclick = function() {
	makeRows();
	oneRowId();
	setFromLocal(invoiceInput);
	calkulator();
	
	var oldRows = Number(localStorage.getItem("rowNumber"));
	var newRows = oldRows += 1;
	
	// UPDATE NUMBER IN ROWS INPUT BOX TO REPRESENT ACTUAL NUMBER OF ROWS
	rows.value = newRows;
	
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("rowNumber", newRows);
	}
};



// RESET 
clearAll.onclick = function() {	
	var opac = 0;
	var showWarning = setInterval(function() {
		opac += 0.01;
		if (opac < 1) {
			warningWrap.style.opacity = opac;
		} else {clearInterval(showWarning);}
	}, 3);
	
	warningWrap.style.display = "block";
};



 // TRUE RESET
trueClear.onclick = function() {
	// SET BUTTON AND INPUT STATES
	newRow.disabled = false;
	rows.disabled = false;
	oneMore.disabled = true;
	
	
	// CLEAR LOCAL STORAGE
	if(typeof(Storage) !== "undefined") {
		localStorage.removeItem("rsToggle");
		localStorage.removeItem("rowNumber");
		
		localStorage.removeItem("totalDue");
		localStorage.removeItem("totalTime");
		
		var idee2 = invoiceInput2[0].getAttribute("id");
		
		localStorage.removeItem(idee2);
		invoiceInput2[0].value = "";
		
		for(var remi = 0; remi < invoiceInput.length; remi++) {
			var idee1 = invoiceInput[remi].getAttribute("id");
			localStorage.removeItem(idee1);
		}
	}
	
	window.location.reload();
};


// CLOSE RESET WARNING
closeWarnng.onclick = function() {
	warningWrap.style.opacity = "0";
	warningWrap.style.display = "none";
};

// OPEN INSTRUCITONS
instructions.onclick = function() {
	var opac = 0;
	var showWarning = setInterval(function() {
		opac += 0.01;
		if (opac < 1) {
			instructionsModal.style.opacity = opac;
		} else {clearInterval(showWarning);}
	}, 3);
	
	instructionsModal.style.display = "block";
};


// CLOSE INSTRUCTIONS
instructionClose.onclick = function() {
	instructionsModal.style.opacity = "0";
	instructionsModal.style.display = "none";
};