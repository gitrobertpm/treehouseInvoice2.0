/*********************************************
 *
 * MY CUSTOM TREEHOUSE CODE REVIEWER INVOICE
 *
 * ROBERT MANOLIS - MARCH 2016
 *
 *********************************************/
"use strict";

//////////////////////// FRONT SHEET SPECIFIC
var hoursFS = document.getElementById("hoursFS");
var dueFS = document.getElementById("dueFS");
var newRowFS = document.getElementById("newRowFS");
var rowsFS = document.getElementById("rowsFS");
var oneMoreFS = document.getElementById("oneMoreFS");
var clearAllFS = document.getElementById("clearAllFS");
var trueClearFS = document.getElementById("trueClearFS");
var invoiceInputTimeFS = document.getElementById("invoiceInputTimeFS");
var invoiceInputDueFS = document.getElementById("invoiceInputDueFS");
/////////////////////////////////////////////
 
var rate = document.getElementById("rate");
var yourInfoInput = document.getElementsByClassName("yourInfoInput");
var invoiceBody = document.getElementById("invoiceBody");
var invoiceRow = document.getElementsByClassName("invoiceRow");
var invoiceInput = document.getElementsByClassName("invoiceInput");
var invoiceInput2 = document.getElementsByClassName("invoiceInput2");
var billable = document.getElementsByClassName("billable");
var clockable = document.getElementsByClassName("clockable");
var warningWrap = document.getElementById("warningWrap");
var closeIt = document.getElementById("close");
var instructions = document.getElementById("instructions");
var instructionsModal = document.getElementsByClassName("instructionsModal")[0];
var instructionClose = document.getElementsByClassName("instructionClose")[0];

var runningCount = 0;
var runningTime = 0;

// SET ELEMENTS AND INFO FROM LOCAL STORAGE IF LOCAL STORAGE EXISTS
window.onload = function() {
	
	// SET INITIAL NUMBER OF ROWS BASED ON PREVIOUS STATE WITH LOCAL STORAGE
	if(typeof(Storage) !== "undefined") {
		for (var lsrn = 1; lsrn <= Number(localStorage.getItem("rowNumberFS")); lsrn++) {
			makeRows();
		}
		
		if (invoiceRow.length > 0) {
			newRowFS.disabled = true;
			oneMoreFS.disabled = false;
		}
		
		// SET TOTALS
		var totalToggle = localStorage.getItem("rsToggleFS");
		
		if (totalToggle) {
			invoiceInputDueFS.value = "$\u00A0" + localStorage.getItem("totalDueFS");
			invoiceInputTimeFS.value = localStorage.getItem("totalTimeFS") + "\u00A0hours";
			
			dueFS.value = "$\u00A0" + localStorage.getItem("totalDueFS");
			hoursFS.value = localStorage.getItem("totalTimeFS") + "\u00A0hours";
			
		} else {
			invoiceInputDueFS.value = "$";
			invoiceInputTimeFS.value = "hour(s)";
			
			dueFS.value = "$";
			hoursFS.value = "hours";
		}
		
		// CHANGE ID AND RESAVE TO LOCAL STORAGE IF OPENING OLD DATA FROM LOCAL STORAGE
		changeId();
		saveToLocal();
	
		// SET STATE OF INPUT THAT CREATES ROWS
		var rsToggle = localStorage.getItem("rsToggleFS");
		
		if (rsToggle) {
			rowsFS.value = localStorage.getItem("rowNumberFS");
			rowsFS.disabled = true;
		}
		
		// LOAD SAVED NOTES IF THERE BE ANY, ARRRGH!  (HA! JUST THOUGHT I'D BE A PIRATE FOR A MINUTE.  :)  )
		invoiceInput2[2].value = localStorage.getItem(invoiceInput2[2].getAttribute("id"));
	} else {
		alert("This invoice uses local storage to save your entires into this form until you hit clear.  You don't seem to have local storage, so some aspects of this App my not function properly and your data will not be saved.");
		invoiceInputDueFS.value = "$";
		invoiceInputTimeFS.value = "hour(s)";
	}
	
	// MAKE SURE CALKULATORS DONT QUIT WORKING
	calkulator();
	calkulator2();
};



// SET/PULL MAIN PERSONAL AND BILLING INFO INTO/OUT OF LOCAL STORAGE
for (var i = 0; i < yourInfoInput.length; i++) {
	// STICK A MARKER ON EACH INPUT	
	yourInfoInput[i].marker = i;
	
	// LOAD INPUTS FROM LOCAL STORAGE
	if(typeof(Storage) !== "undefined") {
	    yourInfoInput[i].value = localStorage.getItem(yourInfoInput[i].getAttribute("id"));
	} else {
	    yourInfoInput[i].value = "";
	}
	
	// SET TO LOCAL STORAGE
	yourInfoInput[i].addEventListener("blur", function() {	
		var idee = yourInfoInput[this.marker].getAttribute("id");
		var val = yourInfoInput[this.marker].value;
		
		// ERROR MESSAGE FOR INCORECT INPUT FOR HOURLY RATE
		if (yourInfoInput[this.marker].getAttribute("id") === "rate") {
			if (isNaN(this.value) || this.value < 0) {
				// ERROR FOR iNCORRECT INPUT
				alert("This input takes dollars per hour in positive numerical values.  Example: 3 or 42 or 420 or 3.14 ");
				rate.value = "";
			}
		}
		
		if(typeof(Storage) !== "undefined") {
		    localStorage.setItem(idee, val);
		}
	});
}



// HELPER FUNCTION TO CHANGE THE ID OF GENERATED INVOICE INPUTS TO INCLUDE A TRAILING INDX OF PARENT'S PARENT SO EACH ID IS UNIQUE FOR PURPOSES OF LOAL STORAGE
var changeId = function() {
	// STICK A MARKER ON INPUT'S PARENT'S PARENT
	for (var ir = 0; ir < invoiceRow.length; ir++) {
	    invoiceRow[ir].marker = ir; 
	}
	
	// CREATE NEW ID
	for (var ci = 0; ci < invoiceInput.length; ci++) {
		var oldIdee = invoiceInput[ci].getAttribute("id");
		var classIndex = invoiceInput[ci].parentNode.parentNode.marker;
		var newIdee = oldIdee + classIndex;
		
		// SET NEW ID
		invoiceInput[ci].setAttribute("id", newIdee);
	}
};

// HELPER FUINCTION TO CHANGE IDS FOR ONE MORE ROW
var oneRowNewId = function () {
	// STICK A MARKER ON INPUT'S PARENT'S PARENT
	invoiceRow[invoiceRow.length - 1].marker = invoiceRow.length - 1; 

	for (var ci = invoiceInput.length - 3; ci < invoiceInput.length; ci++) {
		var oldIdee = invoiceInput[ci].getAttribute("id");
		var classIndex = invoiceInput[ci].parentNode.parentNode.marker;
		var newIdee = oldIdee + classIndex;
		
		// SET NEW ID
		invoiceInput[ci].setAttribute("id", newIdee);
	}
};



// SET/PULL INVOICE ITEMS INTO/OUT OF LOCAL STORAGE
var saveToLocal = function() {
	
	// LOCAL STORAGE
	for (var ii = 0; ii < invoiceInput.length; ii++) {
		invoiceInput[ii].marker = ii;
		
		// IF DATA IN STORAGE THEN LOAD FROM STORAGE ELSE NOTHING
		if(typeof(Storage) !== "undefined") {
			invoiceInput[ii].value = localStorage.getItem(invoiceInput[ii].getAttribute("id"));
		} else {
		    invoiceInput[ii].value = "";
		}
		
		// INPUT VALUE INTO LOCAL STORGAE ON INPUT BLUR
		invoiceInput[ii].addEventListener("blur", function() {	
			var idee = invoiceInput[this.marker].getAttribute("id");
			var val = invoiceInput[this.marker].value;
			
			if (rate.value === "" || rate.value === null) {
				alert("This App can't do any calculations until you enter your hourly rate above.  Just numerical digits please.  Example: 3 or 42 or 420 or 3.14");
			}
			
			if(typeof(Storage) !== "undefined") {
			    localStorage.setItem(idee, val);
			}
		});
	}
};


// HELPER FUNCTION FOR ROUNDING NUMBERS DOWN TO THE HUNDRETH DECIMAL PLACE
var round = function(num, places) {
	return Math.round(num * 100) / 100;
};


// CALULATE AND UPDATE TIME AND DUE TOTALS ON INPUT
var calkulator = function() {
	for (var bill = 0; bill < billable.length; bill++) {
		billable[bill].addEventListener("input", function() {
			
			if (isNaN(this.value) || this.value < 0) {
				// ERROR FOR iNCORRECT INPUT
				alert("This input takes dollars in positive numerical values.  Example: 3 or 42 or 420 or 3.14 ");
			} else {
				// RESET COUNT
				runningCount = 0;
				
				// GET NEW TOTAL
				for (var bill2 = 0; bill2 < billable.length; bill2++) {
					runningCount += Number(billable[bill2].value);
				}
				
				// ROUND TOTAL
				var roundTotal = round(runningCount, -1);

				// PRINT TOTAL
				invoiceInputDueFS.value = "$\u00A0" + Number(roundTotal);
				dueFS.value = "$\u00A0" + Number(roundTotal);
				
				// STORE DATA
				if(typeof(Storage) !== "undefined") {
					localStorage.setItem("totalDueFS", Number(roundTotal));

					// SET TOGGLE TO LOCAL STORAGE SO MACHINE KNOWS WHETHER TO LOAD WITH TOTAL VALUES OR NOT
					localStorage.setItem("rsToggleFS", true);
				}
			}	
		});
	}
};

var calkulator2 = function() {
	for (var bill = 0; bill < billable.length; bill++) {
		clockable[bill].addEventListener("input", function() {
			if (isNaN(this.value) || this.value < 0) {
				// ERROR FOR iNCORRECT INPUT
				alert("This input takes hours in positive numerical values.  Example: 3 or 42 or 420 or 3.14 ");
			} else {
				// RESET COUNT
				runningTime = 0;
				
				// GET NEW TOTAL
				for (var bill2 = 0; bill2 < clockable.length; bill2++) {
					runningTime += Number(clockable[bill2].value);
				}
				
				// ROUND TOTAL
				var roundTotal = round(runningTime, -1);
				
				// PRINT TOTAL
				invoiceInputTimeFS.value = roundTotal + "\u00A0hours";
				hoursFS.value = roundTotal + "\u00A0hours";
				
				// STORE DATA
				if(typeof(Storage) !== "undefined") {
					localStorage.setItem("totalTimeFS", Number(roundTotal));

					// SET TOGGLE TO LOCAL STORAGE SO MACHINE KNOWS WHETHER TO LOAD WITH TOTAL VALUES OR NOT
					localStorage.setItem("rsToggleFS", true);
				}
			}
		});
	}
};



// HELPER FUNCTION TO GENERATE DESIRED NUMBER OF NEW COMPLETE TABLE ROW(S)
var makeRows = function() {
	var tr = document.createElement("tr");
	tr.setAttribute("class", "invoiceRow");
	
	for (var tdip = 1; tdip < 4; tdip++) {
		var td = document.createElement("td");
		var ip = document.createElement("input");
		ip.setAttribute("type", "text");
			ip.setAttribute("class", "invoiceInput");
		if (tdip === 2) {
			ip.setAttribute("class", "invoiceInput clockable");
		} else if (tdip === 3) {
			ip.setAttribute("class", "invoiceInput billable");
		}
		if (tdip === 1) {
			ip.setAttribute("id", "datesFS");
			ip.setAttribute("autocomplete", "off");
		} else if (tdip === 2) {
			ip.setAttribute("id", "inHoursFS");
			ip.setAttribute("autocomplete", "off");
		} else if (tdip === 3) {
			ip.setAttribute("id", "inDueFS");
			ip.setAttribute("autocomplete", "off");
		}
		
		td.appendChild(ip);
		tr.appendChild(td);
	}
	invoiceBody.appendChild(tr);
};

// HELPER FUNCTION TO MAKE ROWS
var makeSomeRowsYo = function() {
	if (rowsFS.value < 1 || rowsFS.value > 42 || isNaN(rowsFS.value)) {
		// ERROR FOR iNCORRECT INPUT
		alert("Please replace the '#' with a number between 1 and 42, then try again.");
	} else {
		newRowFS.disabled = true;
		rowsFS.disabled = true;
		oneMoreFS.disabled = false;
		if(typeof(Storage) !== "undefined") {
		    localStorage.setItem("rowNumberFS", rowsFS.value);
		}
		for (var rowi = 1; rowi <= rowsFS.value; rowi++) {
			makeRows();
		}
	}	
	
	changeId();
	saveToLocal();
	calkulator();	
	calkulator2();	
};


// CREATE ROWS AND SET NUMBER TO LOCAL STORAGE
newRowFS.addEventListener("click", function() {	
	makeSomeRowsYo();
});

// ADD ENTER BUTTON FUNCTIONALITY TO UNPUT
rowsFS.addEventListener("keydown", function(e) {
	if(e.keyCode == 13){
		makeSomeRowsYo();
	}
});

oneMoreFS.disabled = true;

oneMoreFS.onclick = function() {
	makeRows();
	oneRowNewId();
	saveToLocal();
	calkulator();
	calkulator2();
	
	var oldRows = Number(localStorage.getItem("rowNumberFS"));
	var newRows = oldRows += 1;
	
	// UPDATE NUMBER IN ROWS INPUT BOX TO REPRESENT ACTUAL NUMBER OF ROWS
	rowsFS.value = newRows;
	
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("rowNumberFS", newRows);
	}
};


// RESET LOCAL STORAGE FOR ROW NUMBER IMPUT AND RE-ENABLE CREATE ROWS BUTTON
rowsFS.addEventListener("focus", function() {
	newRowFS.disabled = false;
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("rowNumberFS", rowsFS.value);
	}
});


// SET/PULL TOTALS AND NOTES INTO/OUT OF LOCAL STORAGE
invoiceInput2[2].addEventListener("blur", function() {	
	var idee = invoiceInput2[2].getAttribute("id");
	var val = invoiceInput2[2].value;
	
	if(typeof(Storage) !== "undefined") {
	    localStorage.setItem(idee, val);
	} 
});


// RESET 
clearAllFS.onclick = function() {	
	var opac = 0;
	var showWarning = setInterval(function() {
		opac += .01;
		if (opac < 1) {
			warningWrap.style.opacity = opac;
		}
	}, 3);
	
	warningWrap.style.display = "block";
};

 // TRUE RESET
trueClearFS.onclick = function() {
	// SET BUTTON AND INPUT STATES
	newRowFS.disabled = false;
	rowsFS.disabled = false;
	oneMoreFS.disabled = true;
	
	// CLEAR LOCAL STORAGE
	if(typeof(Storage) !== "undefined") {
		localStorage.removeItem("rsToggleFS");
		localStorage.removeItem("rowNumberFS");
		
		localStorage.removeItem("totalDueFS");
		localStorage.removeItem("totalTimeFS");
		
		var idee2 = invoiceInput2[2].getAttribute("id");
		localStorage.removeItem(idee2);
		
		for(var remi = 0; remi < invoiceInput.length; remi++) {
			var idee1 = invoiceInput[remi].getAttribute("id");
			localStorage.removeItem(idee1);
		}
	}
	
	window.location.reload();
};

// CLOSE RESET WARNING
closeIt.onclick = function() {
	warningWrap.style.opacity = "0";
	warningWrap.style.display = "none";
};


// OPEN INSTRUCITONS
instructions.onclick = function() {
	var opac = 0;
	var showWarning = setInterval(function() {
		opac += .01;
		if (opac < 1) {
			instructionsModal.style.opacity = opac;
		}
	}, 3);
	
	instructionsModal.style.display = "block";
};


// CLOSE INSTRUCTIONS
instructionClose.onclick = function() {
	instructionsModal.style.opacity = "0";
	instructionsModal.style.display = "none";
};