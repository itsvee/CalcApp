var app = require('electron').remote; 
var dialog = app.dialog;
var fs = require('fs');

var aVal, bVal, operator, sum;

$('.operator-button').click(function() {

    $('.operator-area').find('.operator-button').removeClass('active');

    operator = this.id;
    aVal = parseInt($('#a-value').val());
    bVal = parseInt($('#b-value').val());

    if ( (isNaN(aVal) || aVal === "") && (isNaN(bVal) || bVal === "") ) {
        $('.input-a').find('.warning').show();
        $('.input-b').find('.warning').show();
        return;
    } else {
        if (isNaN(aVal) || aVal === "") {
            $('.input-a').find('.warning').show();
            return;
        }
        if (isNaN(bVal) || bVal === "") {
            $('.input-b').find('.warning').show();
            return;
        }
    }

    switch (operator) {
        case "plus":
            sum = plusNumber(aVal, bVal);
            break;
        case "minus":
            sum = minusNumber(aVal, bVal);
        break;  
        case "multiply":
            sum = multiplyNumber(aVal, bVal);
            break;
        case "divide":
            sum = divideNumber(aVal, bVal);
        break;   
        case "power":
            sum = powerNumber(aVal, bVal);
            break;      
        default:
            break;
    }

    $('#'+operator).addClass('active');
    $('#result').val(sum);

});

$( "#a-value" ).focus(function() {
    $('.input-a').find('.warning').hide();
});

$( "#b-value" ).focus(function() {
    $('.input-b').find('.warning').hide();
});

$('#save-btn').click(function() {
    saveHistory();
});

$('#load-btn').click(function() {
    loadHistory();
});

$('#clear-btn').click(function() {
    clearInput();
});

function plusNumber(a, b) {
    return a + b;
}

function minusNumber(a, b) {
    return a - b;
}

function multiplyNumber(a, b) {
    return a * b;
}

function divideNumber(a, b) {
    if (b == 0) {
        return 'ERROR (B shouldn\'t be 0)';
    } else {
        return a / b;
    }
}

function powerNumber(a, b) {
    return Math.pow(a, b);
}

function saveHistory() {

    if ( ($('#a-value').val() === "") && ($('#b-value').val() === "") ) {
        $('.input-a').find('.warning').show();
        $('.input-b').find('.warning').show();
        return;
    } else {
        if ($('#a-value').val() === "") {
            $('.input-a').find('.warning').show();
            return;
        }
        if ($('#b-value').val() === "") {
            $('.input-b').find('.warning').show();
            return;
        }
    }

    let obj = { 
        "a"         : aVal,
        "b"         : bVal,
        "operator"  : operator,
        "result"    : sum
    };

    let content = JSON.stringify(obj);

    dialog.showSaveDialog({
        title: 'Save history',
        nameFieldLabel: 'calapps',
        filters: [{
            name: 'calapps',
            extensions: ['json']
        }]
    }, (fileName) => {
        if (fileName) {
            fs.writeFile(fileName, content, (err) => {
                if(err){
                    dialog.showErrorBox("Unsuccess!", "An error ocurred creating the file "+ err.message);
                }
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Success!',
                    message: 'The file has been succesfully saved'
                });
            });
        }
    });
}

function loadHistory() {

    dialog.showOpenDialog({
        title: 'Open history',
        filters: [{
            extensions: ['json']
        }]
    }, (fileNames) => {
        // fileNames is an array that contains all the selected
        if(fileNames === undefined) {
            console.log("No file selected");
            return;
        }
    
        fs.readFile(fileNames[0], 'utf-8', (err, data) => {
            if(err){
                dialog.showErrorBox("Unsuccess!", "An error ocurred reading the file "+ err.message);
                return;
            }

            restoreData(data);

        });
    });

}

function restoreData(data) {
    var value = JSON.parse(data);
    console.log(value);

    if ( (value.a == "" || isNaN(value.a)) && (value.b == "" || isNaN(value.b)) && (value.operator == "") && (value.result == "" || isNaN(value.result)) ) {
        dialog.showErrorBox("Unsuccess!", "An error ocurred reading the file : some data has missing");
    } else {
        $('.operator-area').find('.operator-button').removeClass('active');
        $('#a-value').val(value.a);
        $('#b-value').val(value.b);
        $('#'+value.operator).addClass('active');
        $('#result').val(value.result);
    }

}  

function clearInput() {
    $('.operator-area').find('.operator-button').removeClass('active');
    $('#a-value').val('');
    $('#b-value').val('');
    $('#result').val('');
    aVal = '';
    bVal = '';
    operator = '';
    sum = '';
}