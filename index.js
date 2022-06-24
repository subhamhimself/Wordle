import { keys_backup, words_backup } from './words.js'
let keys = keys_backup;
let words = words_backup;
let guess = "";
let answer = "soare";
let coeff = [0, 0, 0, 0, 0];
let guess_number = 1;
let game_over = 0;

function compare(x, y) {
    coeff = [0, 0, 0, 0, 0];
    let a = x.split("");
    let b = y.split("");
    // console.log(a+' '+b);
    let j = 0;
    for (let i = 0; i < 5; i++)
        if (a[i] == b[i]) {
            coeff[i] = 2;
            b[i] = ' ';
            a[i] = '_';
        }
    // else {
    for (let i = 0; i < 5; i++)
        if (b[i] != ' ') {
            coeff[i] = 0;
            j = -1;
            while (++j < 5)
                if (b[j] == a[i]) {
                    coeff[i] = 1;
                    b[j] = ' ';
                    break;
                }
        }
    return coeff[0] + 3 * coeff[1] + 9 * coeff[2] + 27 * coeff[3] + 81 * coeff[4];
}

function calculate_score(s) 
{
    // f(i,243)
    let x = new Array(243); 
    for (let i=0; i<243; i++) x[i] = 0;
    for(let i=0;i<243;i++)
    x[i]=0;
    let ans=0.00;

    words.forEach(element => {
        x[compare(s,element)]++;
    });
    let t=words.length;
    for (let i=0; i<243; i++)
    if(x[i]>0)
    if(x[i]>0) ans += x[i]*Math.log2(t/x[i]);
    return ans/t;
}



function colour() {
    if (compare(guess, answer) == 242) game_over = 1;
    for (let i = 0; i < 5; i++)
        if (coeff[i] == 0)
            document.getElementById('field' + guess_number + i).style.backgroundColor = 'gray';
        else if (coeff[i] == 1)
            document.getElementById('field' + guess_number + i).style.backgroundColor = 'yellow';
        else document.getElementById('field' + guess_number + i).style.backgroundColor = 'green';

}

function filter_data() {
    let result = compare(guess,answer);
    let n = keys.length;
    console.log(n);
    let arr = new Array();
    console.log(keys);
    // f(i, n)
    // for(let i=0;i<n;i++)
    for (let i = 0; i < n; i++)
        if (compare(guess, keys[i]) == result)
        arr.push(keys[i]);
    keys = arr;
}
function is_valid_word(word) {
    for (var j = 0; j < keys_backup.length; j++)
        if (keys_backup[j].match(word)) return 1;
    return 0;
}







/* This creates all the OTP input fields dynamically. Change the5 variable  to change the OTP Length */
for (let k = 1; k <= 6; k++) {
    const element = document.getElementById('Guess' + k);
    for (let i = 0; i < 5; i++) {
        let inputField = document.createElement('input'); // Creates a new input element
        // inputField.className = "w-12 h-12 bg-gray-100 border-gray-100 outline-none focus:bg-gray-200 m-2 text-center rounded focus:border-blue-400 focus:shadow-outline";
        inputField.className = "w-12 h-12 bg-gray-100 border-gray-100 shadow-outline focus:bg-gray-200 m-2 text-center rounded focus:border-blue-400 focus:shadow-outline";
        // inputField.className = "w-12 h-12 bg-gray-200 border-blue-400 shadow-outline m-2 text-center rounded ";

        // Do individual OTP input styling here;
        inputField.style.cssText = "font-size: 26px; text-shadow: 0 0 0 gray;"; // Infield text styling. This css hides the text caret
        inputField.id = 'field' + k + i; // Don't remove
        inputField.maxLength = 1; // Sets individfield length to 1 char
        // if (i!=0 || k!=1) inputField.readonly = true;
        element.appendChild(inputField); // Adds the infield to the parent div (Guess)
    }
    /*  This is for switching back and forth the input box for user experience */
    const inputs = document.querySelectorAll('#Guess' + k + ' > *[id]');
    for (let i = 0; i < inputs.length; i++)
        if (k != 1 || i != 0)
            inputs[i].setAttribute('readonly', true);
    // else inputs[i].setAttribute('readonly',false);

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keydown', function (event) {
            if (event.key === "Backspace") {
                if (inputs[i].value == '') {
                    if (i != 0) {
                        inputs[i - 1].removeAttribute('readonly');
                        inputs[i].setAttribute('readonly', true);
                        inputs[i - 1].focus();
                    }
                } else {
                    inputs[i].value = '';
                }

            }
        });
        inputs[i].addEventListener('input', function () {
            inputs[i].value = inputs[i].value.toUpperCase(); // Converts to Upper case. Remove .toUpperCase() if conversion isnt required.
            if (inputs[i].value > 'Z' || inputs[i].value < 'A') inputs[i].value = '';
            if (i === inputs.length - 1 && inputs[i].value !== '') {
                return true;
            } else if (inputs[i].value !== '') {
                inputs[i].setAttribute('readonly', true);
                inputs[i + 1].removeAttribute('readonly');
                inputs[i + 1].focus();
            }
        });
    }
}

for (let i = 1; i < 7; i++) {
    let temp = document.getElementById('field' + i + 4);
    temp.addEventListener('keydown', function (event) {
        if (event.key == 'Enter' && temp.value != '') {
            guess = "";
            let p = document.querySelectorAll('#Guess' + i + ' > *[id]');
            for (let i = 0; i < 5; i++)
                guess += p[i].value.toLowerCase();
            console.log(calculate_score( guess));
            // console.log(!is_valid_word(guess));

            if (!is_valid_word(guess))
                alert("Invalid word entered !");
            else {
                // console.log(guess);
                colour();
                if (game_over == 1) {
                    temp.setAttribute('readonly', true);
                    console.log("win in " + guess_number + ' guesses');
                }
                else {
                    guess_number++;
                    temp.setAttribute('readonly', true);
                    if (guess_number < 7) {
                        document.getElementById('field' + guess_number + 0).removeAttribute('readonly');
                        document.getElementById('field' + guess_number + 0).focus();
                    }
                    else console.log("You lost");
                }
                filter_data(guess,compare(guess,answer));
            }
        }
    });
}

document.getElementById('field' + 1 + 0).focus();



