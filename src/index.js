const URL = 'http://localhost:3000/pups'
const dogBar = document.querySelector('#dog-bar')
const dogInfo = document.querySelector('#dog-info')
const filter = document.querySelector('#good-dog-filter')
let dogArray

function main(){
    fetchDoggo()
    dogListener()
    filterGood()
}

main()


function fetchDoggo(){
    fetch(URL)
    .then(resp => resp.json())
    .then(json => {
        dogArray = json
        renderDogs(json)        
    })
}

function renderDogs(dogs){
    dogs.forEach(d => {
        render(d)
    })
}

function render(d){
    const span = document.createElement('span')
    span.innerText = d.name
    span.id = d.id

    dogBar.appendChild(span)
}

function dogListener(){
    dogBar.addEventListener("click", event => {
        if (event.target.tagName === 'SPAN'){
            dogInfo.innerHTML = ''
            showDog(event)
        }
    })
}

function showDog(e){
    const img = document.createElement('img')
    img.src = dogArray[e.target.id-1].image

    const h2 = document.createElement('h2')
    h2.innerText = dogArray[e.target.id-1].name

    const button = document.createElement('button')
    button.innerText = (dogArray[e.target.id-1].isGoodDog) ? 'Good Dog!' : 'Bad Dog!'
    button.addEventListener("click", event => {
        if (button.innerText === 'Good Dog!'){
            button.innerText = 'Bad Dog!'
        } else button.innerText = 'Good Dog!'
        changeDogGoodness(e)
    })

    dogInfo.appendChild(img)
    dogInfo.appendChild(h2)
    dogInfo.appendChild(button)
}

function changeDogGoodness(e){
    const configDog = {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            isGoodDog: !dogArray[e.target.id-1].isGoodDog
        })
    }

    fetch(URL + '/' + e.target.id, configDog)
    .then(resp => resp.json())
    .then(json => {
        dogArray.find(d => d.id == json.id).isGoodDog = json.isGoodDog

        if (filter.innerText === 'Filter good dogs: ON' && !json.isGoodDog){
            let a = document.getElementById(json.id)
            a.remove()
        } else if (filter.innerText === 'Filter good dogs: ON' && json.isGoodDog){
            render(json)
        }
    })
}

function updateDogs(){
    if (filter.innerText === 'Filter good dogs: ON'){
        const goodDoggos = dogArray.filter(d => d.isGoodDog === true)
        goodDoggos.forEach(render)
    }
}

function filterGood(){
    filter.addEventListener("click", event => {
      if (filter.innerText === 'Filter good dogs: OFF'){
          filter.innerText = 'Filter good dogs: ON'
          dogBar.innerHTML = ''
          const goodDoggos = dogArray.filter(d => d.isGoodDog === true)
          goodDoggos.forEach(render)
      } else if (filter.innerText === 'Filter good dogs: ON'){
          filter.innerText = 'Filter good dogs: OFF'
          dogBar.innerHTML = ''
          renderDogs(dogArray)
      }
    })
}