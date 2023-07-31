const wordEl=document.getElementById("word")
const wrongLettersEl=document.getElementById("wrong-letters")
const playAgainBtn=document.getElementById("play-button")
const popup=document.getElementById("popup-container")
const notification=document.getElementById("notification-container")
const finalMessage=document.getElementById("final-message")

const figureParts=document.querySelectorAll(".figure-part")

async function getRandomWord() {
    const apiUrl = "https://random-word-api.herokuapp.com/word?number=1"; // API endpoint to get a single random word
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data[0]; // The API returns an array of words, we get the first one
    } catch (error) {
      console.error("Error fetching random word:", error);
      return null;
    }
}
let selectedWord;

async function play(){
    try{
        selectedWord=await getRandomWord()
        console.log(selectedWord);//this is for cheating
        displayWord()
        
    }
    catch (error) {
        console.error("Error while processing random word:", error);
    }
    
}




//const words=["application","programming","interface","wizard","bear","tiger","cat"]; //this is for synchronous random word 

//let selectedWord=words[Math.floor(Math.random()*words.length)]
// console.log(selectedWord);

const correctLetters=[]
const wrongLetters=[]

//show hidden word
function displayWord(){
    
    
    wordEl.innerHTML=`
    ${selectedWord.split('')
        .map(letter=> {return `<div class="letter">${correctLetters.includes(letter)?letter:''}</div>`})
        .join('')
    }

    `;
    const innerWord=wordEl.innerText.replace(/\n/g,'')//this is for removing \n
    
    if(innerWord===selectedWord){
        finalMessage.innerText="Congragulations! You Won"
        popup.style.display="flex"
    }
    
}
function updateWrongLettersEl(){
    //display wrong letters
    wrongLettersEl.innerHTML=`
    ${wrongLetters.length>0 ?`<p>Wrong</p>`:``}
    ${wrongLetters.map(letter=>`<span>${letter}</span>`)}
    `
    //display parts
    figureParts.forEach((part,index)=>{
        const errors=wrongLetters.length
        if(index<errors){
            part.style.display="block"
        }
        else{
            part.style.display="none"
        }
    })
    //check if lost
    if(wrongLetters.length==figureParts.length){
        finalMessage.innerText="Unfortunately you lost"
        popup.style.display="flex"
    }

}
function showNotification(){
    notification.classList.add("show")

    setTimeout(() => {
    notification.classList.remove("show")
        
    }, 2000);
}

//keydown letter press
window.addEventListener("keydown",e=>{
     
    
    if ((e.code >= 'KeyA' && e.code <= 'KeyZ'|| e.code=="Quote")&&popup.style.display!="flex"){//checking the key is letter quote is for the i
        const letter=e.key
        

        if(selectedWord.includes(letter)){
            if(!correctLetters.includes(letter)){
                correctLetters.push(letter)
                 displayWord()
            }
            else{
                showNotification()
            }
        }
        else{
            if(!wrongLetters.includes(letter)){
                wrongLetters.push(letter)
                updateWrongLettersEl()
            }
            else{
                showNotification()
            }
        }
    }
    
})
//restart game

playAgainBtn.addEventListener("click",()=>{
    //empty arrays
    correctLetters.splice(0)
    wrongLetters.splice(0)

    play() 

    updateWrongLettersEl()

    popup.style.display="none"
})


play()








