$(function(){

    var sum;
    $('.operator-button').click(function() {

        operator = this.id;
        aVal = parseInt($('#a-value').val());
        bVal = parseInt($('#b-value').val());
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

        $('#result').val(sum);

    });

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
        return 'ERROR';
    } else {
        return a / b;
    }
}

function powerNumber(a, b) {
    return Math.pow(a, b);
}