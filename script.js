const inputSlider = document.querySelector("[lengthSlider]");
const displayLength = document.querySelector("[lengthNumber]");
const displayPassword = document.querySelector("[displayPassword]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[displayCopied-Msg]");
// const lengthSlider = document.querySelector("[lengthSlider]");
const dataIndicator = document.querySelector("[data-indicator]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const number = document.querySelector("#number");
const symbol = document.querySelector("#symbol");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const Symbol = '!@#$%^&*?<>"+_-=.';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color grey
setIndicator("#ccc");


//set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    displayLength.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%";
}

// handleSlider();


//set indicator color
function setIndicator(color){
    dataIndicator.style.backgroundColor = color;
    dataIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//get random


function getRndInteger(min,max){
        return Math.floor(Math.random() * (max-min)) + min;
}

function getNumber()
{
    return getRndInteger(0,9);
}

function getlowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function getuppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}


function getSymbol()
{
    const sybIndex = getRndInteger(0,Symbol.length);
    return Symbol.charAt(sybIndex);
}

function calcStrength(){
    let hasUpper = false;
    let hasSmaller = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercase.checked)
    {
        hasUpper = true;
    }
    if(lowercase.checked)
    {
        hasSmaller = true;
    }
    if(number.checked)
    {
        hasNumber = true;
    }
    if(symbol.checked)
    {
        hasSymbol = true;
    }

    if(hasUpper && hasSmaller && (hasSymbol || hasNumber) && passwordLength>=8)
    {
        setIndicator("#0f0");
    }
    else if((hasUpper || hasSmaller) && (hasSymbol || hasNumber) && passwordLength>=6)
    {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}


//Asynchronous method to copy text from password display

async function copyContent() {
    try{        
        await navigator.clipboard.writeText(displayPassword.value);
        copyMsg.innerText= "copied";
    }
    catch(e)
    {
        copyMsg.innerText = "Failed";
    }
    //to make copywala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}


function shufflePassword(array) {
    //Fisher Yeats Method to shuffle

    for(let i = array.length - 1; i>0 ;i--)
    {
        //to find random index
        const j = Math.floor(Math.random() * (i+1));
        //swap with random index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;  
    });

    if(passwordLength<checkCount)
    {
        passwordLength = checkCount;
        handleSlider(); 
    }
}

allCheckBox.forEach( (checkbox) => {
        checkbox.addEventListener('change',handleCheckBoxChange);
})


//event handling

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
} )

copyBtn.addEventListener('click', () => {
    if(displayPassword.value)
    {
        copyContent();
    }
})

generateBtn.addEventListener('click',() => {
    //none of any checkbox is selected
    if(checkCount==0)
    {
        return;
    }

    if(passwordLength<checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }


    //lets start the journey to generate new password

    //remove old password
    password = "";

    //to stuff password

    // if(uppercase.checked)
    // {
    //     password = password + getuppercase();
    // }

    // if(lowercase.checked)
    // {
    //     password = password + getlowercase();
    // }

    // if(number.checked)
    // {
    //     password = password + getNumber();
    // }

    // if(symbol.checked)
    // {
    //     password = password + getSymbol();
    // }


    let funcArr = [];

    if(uppercase.checked)
    {
        funcArr.push(getuppercase);
    }
    if(lowercase.checked)
    {
        funcArr.push(getlowercase);
    }
    if(number.checked)
    {
        funcArr.push(getNumber);
    }
    if(symbol.checked)
    {
        funcArr.push(getSymbol);
    }

    for(let i=0;i<funcArr.length;i++)
    {
        password += funcArr[i]();
    }

    for(let i =0 ;i<passwordLength-funcArr.length;i++)
    {
        let randIndex = getRndInteger(0,funcArr.length  );
        password += funcArr[randIndex]();
    }

    //to suffle ready paaword charachter
    password = shufflePassword(Array.from(password));

    //to display password
    displayPassword.value = password;
    displayPassword.style.fontSize = "large";
    displayPassword.style.paddingLeft = "2rem";

    //to calculate length
    calcStrength();

});