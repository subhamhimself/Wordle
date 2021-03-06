import { keys_backup, words_backup, initial_suggestions, initial_rare_suggestions } from './words.js'
let rare_words = keys_backup;
let words = words_backup;
let guess = "";
let games_played = 0;
let allow_rare_words = false;
let total_guesses = 0;
let score_of_guess = 0;
let old_size = 1;
let suggestions_on = false;
let stats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let answer = words_backup[Math.floor((Math.random() * 100000000)) % words_backup.length];
let coeff = [0, 0, 0, 0, 0];
let guess_number = 1;
let game_over = 0;

function start_game() {
    document.getElementById('guess-analysis').innerHTML = '';
    rare_words = keys_backup.slice();
    words = words_backup.slice();
    document.getElementById('info').innerHTML = Math.log2(words.length).toPrecision(5) + ' Bits';

    guess = "";
    answer = words_backup[Math.floor((Math.random() * 100000000)) % words_backup.length];
    coeff = [0, 0, 0, 0, 0];
    guess_number = 1;
    game_over = 0;
    for (let k = 1; k <= 6; k++) {
        const element = document.getElementById('Guess' + k);
        element.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            let inputField = document.createElement('input');
            inputField.className = "w-12 h-12 bg-gray-100 border-gray-100 shadow-outline focus:bg-gray-200 m-2 text-center rounded focus:border-blue-400 focus:shadow-outline";
            inputField.style.cssText = "font-size: 26px; text-shadow: 0 0 0 gray;";
            inputField.id = 'field' + k + i;
            inputField.maxLength = 1;
            element.appendChild(inputField);
        }
        const inputs = document.querySelectorAll('#Guess' + k + ' > *[id]');
        for (let i = 0; i < inputs.length; i++)
            if (k != 1 || i != 0)
                inputs[i].setAttribute('readonly', true);
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
                inputs[i].value = inputs[i].value.toUpperCase();
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
            if (event.key == 'Enter' && temp.value != '')
                if (!game_over) {
                    guess = "";
                    let p = document.querySelectorAll('#Guess' + i + ' > *[id]');
                    for (let i = 0; i < 5; i++)
                        guess += p[i].value.toLowerCase();
                    if (!is_in_array(guess, keys_backup))
                        alert("Invalid word entered !");
                    else Input();
                }
                else {
                    start_game();
                }
        });
    }
    if (suggestions_on) {
        suggest();
    }

    document.getElementById('field' + 1 + 0).focus();
}
function compare(x, y) {
    coeff = [0, 0, 0, 0, 0];
    let a = x.split("");
    let b = y.split("");
    let j = 0;
    for (let i = 0; i < 5; i++)
        if (a[i] == b[i]) {
            coeff[i] = 2;
            b[i] = ' ';
            a[i] = '_';
        }
    for (let i = 0; i < 5; i++)
        if (a[i] != '_') {
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

function calculate_score(s) {
    let x = new Array(243);
    for (let i = 0; i < 243; i++) x[i] = 0;
    for (let i = 0; i < 243; i++)
        x[i] = 0;
    let ans = 0.00;

    words.forEach(element => {
        x[compare(s, element)]++;
    });
    let t = words.length;
    for (let i = 0; i < 243; i++)
        if (x[i] > 0)
            if (x[i] > 0) ans += x[i] * Math.log2(t / x[i]);
    return ans / t;
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
    let result = compare(guess, answer);
    let n = words.length;
    old_size = n;
    let arr = new Array();
    for (let i = 0; i < n; i++)
        if (compare(guess, words[i]) == result)
            arr.push(words[i]);
    words = arr;
}
function is_in_array(word, arr) {
    for (var j = 0; j < arr.length; j++)
        if (arr[j].match(word)) return 1;
    return 0;
}


function suggestions() {
    if (allow_rare_words && words.length == words_backup.length) return initial_rare_suggestions;
    if (words.length == words_backup.length) return initial_suggestions;
    let scores = [];
    for (let i = 0; i < words.length; i++)
        scores.push([calculate_score(words[i]) + 0.00002, words[i]]);
    for (let i = 0; i < words_backup.length; i++)
        scores.push([calculate_score(words_backup[i]) + 0.00001, words_backup[i]]);
    if (allow_rare_words)
        for (let i = 0; i < rare_words.length; i++)
            scores.push([calculate_score(rare_words[i]), rare_words[i]]);

    scores.sort();
    scores.reverse();
    scores = scores.slice(0,40);
    return scores;
}
function analyze() {
    document.getElementById('info').innerHTML = Math.log2(words.length).toPrecision(5) + ' Bits';

    let element = document.getElementById('guess-analysis');
    let sugg = document.createElement('div');
    if (score_of_guess <= -Math.log2(words.length / old_size) && score_of_guess > 0)
        sugg.className = "bg-green-300 flex flex-row my-1 border-2 border-black disable-select disable-select"
    else sugg.className = "bg-red-300 flex flex-row my-1 border-2 border-black disable-select disable-select"
    if (game_over)
        sugg.className = "bg-green-300 flex flex-row my-1 border-2 border-black disable-select disable-select"
    let wrd = document.createElement('h1');
    wrd.innerHTML = guess.toUpperCase();
    if (game_over) wrd.innerHTML = guess.toUpperCase() + '  is the answer !';
    wrd.className = "text-xl mx-2 flex-1 font-bold";
    sugg.appendChild(wrd);
    wrd = document.createElement('h1');
    wrd.innerHTML = score_of_guess.toPrecision(5);
    wrd.className = "text-xl mx-2 flex-1 font-bold";
    if (!game_over)
        sugg.appendChild(wrd);
    wrd = document.createElement('h1');
    wrd.className = "text-xl flex-1 font-bold"
    wrd.innerHTML = (-Math.log2(words.length / old_size)).toPrecision(5);
    if (!game_over)
        sugg.appendChild(wrd);
    element.appendChild(sugg);
}
function suggest() {
    if (game_over || (guess_number > 6))
        document.getElementById('list').innerHTML = "";
    else if (suggestions_on) {
        let temp = suggestions();
        const element = document.getElementById('list');
        element.innerHTML = '';
        if (words.length == 1)
            temp = [[0, words[0]]];
        let t = [];
        let k =[];
        for(let i=0;i<35 && i<temp.length;i++)
        if(!is_in_array(temp[i][1],t))
        {
        k.push(temp[i]);
        t.push(temp[i][1]);
        }
        temp = k;
        for (let i = 0; i < 9 && i < temp.length; i++) {
            let sugg = document.createElement('div');
            sugg.className = "hover:bg-yellow-300 bg-yellow-200 flex flex-row my-1 border-2 border-black disable-select disable-select"
            let wrd = document.createElement('h1');
            wrd.innerHTML = temp[i][1].toUpperCase();
            wrd.className = "text-xl mx-2 flex-1 font-bold";
            let scr = document.createElement('h1');
            if (temp[i][0] == 0)
                scr.innerHTML = temp[i][1].toUpperCase() + " is the answer!";
            else
                scr.innerHTML = temp[i][0].toPrecision(5);;
            scr.className = "text-xl flex-1 font-bold"
            if (temp[i][0])
                sugg.append(wrd);
            sugg.append(scr);
            element.appendChild(sugg);
        }
        let cards = element.children;
        for (let i = 0; i < cards.length; i++)
            cards[i].addEventListener('click', function () {
                guess = temp[i][1];
                Input();
            });

    }
    else
        document.getElementById('list').innerHTML = "";
}
function Input() {
    score_of_guess = calculate_score(guess);

    let temp = document.getElementById('Guess' + guess_number);
    let fields = temp.children;
    for (let i = 0; i < 5; i++)
        fields[i].value = guess[i].toUpperCase();
    colour();
    if (game_over == 1) {
        analyze();
        score_analyse();
        suggest();
    }
    else {
        guess_number++;
        if (guess_number < 7) {
            document.getElementById('field' + guess_number + 0).removeAttribute('readonly');
            document.getElementById('field' + guess_number + 0).focus();
            filter_data(guess, compare(guess, answer));
            analyze();
            suggest();
        }
        else {
            game_over = 1;
            score_analyse();
        }

    }

}
document.getElementById('suggestions-button').addEventListener('click', function () {
    suggestions_on = !suggestions_on;
    let temp = 'Turn on suggestions';
    if (suggestions_on)
        temp = 'Turn off suggestions'
    document.getElementById('suggestions-button').innerHTML = temp;
    suggest();
})
document.getElementById('rare-words').addEventListener('click', function () {
    allow_rare_words = !allow_rare_words;
    suggest();
})
function score_analyse() {
    total_guesses += guess_number;
    games_played++;
    stats[guess_number]++;
    document.getElementById('played').innerHTML = games_played;
    document.getElementById('average').innerHTML = (total_guesses / games_played).toPrecision(3);
    for (let i = 1; i <= 6; i++)
        document.getElementById('stat' + i).innerHTML = i + ':' + stats[i];
    document.getElementById('fail').innerHTML = stats[7];


}
document.getElementById('restart-game').addEventListener('click', function () {
    start_game();
});
start_game();








