var app = require('electron').remote; 
var dialog = app.dialog;
var fs = require('fs');
const os = require('os');

var uuid = os.userInfo().uid+'-'+os.userInfo().username;
var urlApi = "https://semiotic-axis-194016.appspot.com/api/";

var aVal, bVal, operator, sum, token;

localStorage.clear();

// if ((localStorage.getItem("token") === null)) {
//     $.ajax({
//         method: "POST",
//         url: urlApi+"getToken",
//         data: { uuid: uuid }
//     }).done(function( result ) {
//         if(!result.error) {
//             token = result.data.token;
//             localStorage.setItem("token", token);
//         }
//     });
// } else {
//     token = localStorage.getItem("token");
// }

$('.operator-button').click(function() {

    $('.operator-area').find('.operator-button').removeClass('active');

    operator = this.id;
    aVal = parseFloat($('#a-value').val());
    bVal = parseFloat($('#b-value').val());

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
        if ($('#result').val() === "") {
            $('.operator-area').find('.warning').show();
            return;
        }       
    }

    if($("#save-cloud-check").is(':checked')) {
        saveToCloud();
    } else {
        saveHistory();
    }

});

$('#load-btn').click(function() {
    if($("#save-cloud-check").is(':checked')) {
        loadFromCloud();
    } else {
        loadHistory();
    }
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

function saveToCloud(){
    if (typeof token !== 'undefined') {
        $('#loading').toggle();
        $.ajax({
            method: "POST",
            url: urlApi+"saveResult",
            data: { 
                token       :   token,
                a_value     :   aVal,
                b_value     :   bVal,
                operator    :   operator
            }
        }).done(function( result ) {
            if(!result.error) {
                $('#loading').toggle();
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Success!',
                    message: 'The history has been succesfully saved on cloud'
                });
            }
        }).fail (function(jqxhr, textStatus, errorThrown)  {
            $('#loading').toggle();
            dialog.showErrorBox("Unsuccess!", "An error ocurred saving the history");
        });
    } else {
        if ((localStorage.getItem("token") === null)) {
            $('#loading').toggle();
            $.ajax({
                method: "POST",
                url: urlApi+"getToken",
                data: { uuid: uuid }
            }).done(function( result ) {
                if(!result.error) {
                    token = result.data.token;
                    localStorage.setItem("token", token);
                    $('#loading').toggle();
                    saveToCloud();
                }
            }).fail (function(jqxhr, textStatus, errorThrown)  {
                $('#loading').toggle();
                dialog.showErrorBox("Unsuccess!", "An error ocurred saving the history");
            });
        } else {
            token = localStorage.getItem("token");
        }       
    }
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

function loadFromCloud() {
    if (token !== "") {
        $('#loading').toggle();
        $.ajax({
            method: "POST",
            url: urlApi+"loadResult",
            data: { 
                token       :   token
            }
        }).done(function( result ) {
            if(!result.error) {
                if (result.length <= 0) {
                    $('#loading').toggle();
                    dialog.showErrorBox("Sorry!", "You don't have some history on cloud");
                    return;
                }
                aVal = result.data[0].a_value;
                bVal = result.data[0].b_value;
                operator = result.data[0].operator;
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
                let obj = { 
                    "a"         : aVal,
                    "b"         : bVal,
                    "operator"  : operator,
                    "result"    : sum
                };
            
                let content = JSON.stringify(obj);
                $('#loading').toggle();
                restoreData(content);
            }
        }).fail (function(jqxhr, textStatus, errorThrown)  {
            $('#loading').toggle();
            dialog.showErrorBox("Unsuccess!", "An error ocurred loading the history");
            console.log("Error: " + textStatus + " : " + errorThrown) ;
        });
    }   
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
        aVal = value.a;
        bVal = value.b;
        operator = value.operator;
        $('.operator-area').find('.operator-button').removeClass('active');
        $('.input-a').find('.warning').hide();
        $('.input-b').find('.warning').hide();
        $('.operator-area').find('.warning').hide();
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
    $('.input-a').find('.warning').hide();
    $('.input-b').find('.warning').hide();
    $('.operator-area').find('.warning').hide();
    aVal = '';
    bVal = '';
    operator = '';
    sum = '';
}