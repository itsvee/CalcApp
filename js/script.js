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
        return false;
    } else {
        if (isNaN(aVal) || aVal === "") {
            $('.input-a').find('.warning').show();
            return false;
        }
        if (isNaN(bVal) || bVal === "") {
            $('.input-b').find('.warning').show();
            return false;
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
                    alert();
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