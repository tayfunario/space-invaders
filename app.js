// arkaplanı if bloklarıyla kontrol ederek oynatacaktım.
// sonradan vazgeçip, o işlem için ayrı bir interval ekleyerek bu sorunu hallettim



// ****************************************

// selectors
const container = document.querySelector('.container')
const arkaplan_container = document.querySelector('.arkaplan-container')


// değişkenler
let anaInterval
let arkaplanInterval
let hareketInterval
let engelInterval
let gunship = new Gunship(300)
let arkaplanlar = [new Arkaplan(0), new Arkaplan(780)]
let engeller = []
let meteorlar = []
let mermiler = [new Mermi()]

// constructor
function Arkaplan(alt) {
    this.alt = alt
    this.html = document.createElement('img')

    const html = this.html
    html.style.bottom = `${this.alt}px`
    html.setAttribute('class', 'arkaplan')
    html.setAttribute('src', 'arkaplan.png')
    arkaplan_container.appendChild(html)
}

function Gunship(sol) {
    this.sol = sol
    this.html = document.createElement('img')

    const html = this.html
    html.style.left = `${sol}px`
    html.setAttribute('class', 'gunship')
    html.setAttribute('src', 'gunship2.png')
    container.appendChild(html)
}

function Engel(sol, width, height) {
    this.sol = sol
    this.alt = 800
    this.html = document.createElement('div')

    const html = this.html
    html.classList.add('engel')
    html.style.width = `${width}px`
    html.style.height = `${height}px`
    html.style.bottom = `${this.alt}px`
    html.style.left = `${sol}px`
    container.appendChild(html)
}

function Mermi() {
    this.left = gunship.sol + 48
    this.bottom = 90
    this.html = document.createElement('div')

    const html = this.html
    html.classList.add('mermi')
    html.style.bottom = `${this.bottom}px`
    html.style.left = `${this.left}px`
    container.appendChild(html)
}

function Meteor(sol, alt) {
    this.left = sol
    this.bottom = alt
    this.html = document.createElement('div')

    const html = this.html
    html.classList.add('meteor')
    html.style.left = sol + 'px'
    html.style.bottom = alt + 'px'

    container.appendChild(html)
}

// event listener
document.addEventListener('keydown', function(e) {
    if (hareketInterval == null) {
        switch (e.key) {
            case 'ArrowRight':
                hareketInterval = setInterval(function() {
                    if (gunship.sol <= 600) {
                        gunship.sol += 2
                        gunship.html.style.left = `${gunship.sol}px`
                    }
                }, 5)
                break
            case 'ArrowLeft':
                hareketInterval = setInterval(function() {
                    if (gunship.sol >= 0) {
                        gunship.sol -= 2
                        gunship.html.style.left = `${gunship.sol}px`
                    }
                }, 5)
                break
        }
    }

})

document.addEventListener('keyup', function(e) {
    switch (e.key) {
        case 'ArrowRight':
            clearInterval(hareketInterval)
            hareketInterval = null
            break
        case 'ArrowLeft':
            clearInterval(hareketInterval)
            hareketInterval = null
            break
        case ' ':
            mermiler.push(new Mermi())
    }
})

// fonksiyon
function meteorlariYukle() {
    let sol = 60
    for (let i = 0; i < 10; i++) {
        let alt = 700
        meteorlar.push(new Meteor(sol, alt))
        sol += 60
    }
    sol = 60
    for (let i = 0; i < 10; i++) {
        let alt = 650
        meteorlar.push(new Meteor(sol, alt))
        sol += 60
    }
    sol = 60
    for (let i = 0; i < 10; i++) {
        let alt = 600
        meteorlar.push(new Meteor(sol, alt))
        sol += 60
    }
}

function mermiKontrol() {
    for (let mermi of mermiler) {
        for (let met of meteorlar) {
            if (mermi.bottom + 30 >= met.bottom && mermi.left + 5 > met.left && mermi.left < met.left + 40) {
                meteorlar.splice(meteorlar.indexOf(met), 1)
                met.html.remove()
                mermi.html.style.display = 'none'
                mermiler.splice(mermiler.indexOf(mermi), 1)
            }
        }
    }
}

function oyunBitti() {
    if (meteorlar.length == 0) {
        clearInterval(anaInterval)
        clearInterval(arkaplanInterval)
        clearInterval(engelInterval)
        alert('oyunu kazandınız!')
        setTimeout(() => {
            location.reload()
        }, 1);
    }
}

// fonksiyonları çağır
meteorlariYukle()


// interval
anaInterval = setInterval(function() {
    for (let i of arkaplanlar) {
        i.alt -= 1
        i.html.style.bottom = `${i.alt}px`
    }

    for (let i of engeller) {
        i.alt -= 5
        i.html.style.bottom = `${i.alt}px`
    }

    for (let i of mermiler) {
        i.bottom += 15
        i.html.style.bottom = `${i.bottom}px`
        if (i.bottom > 800) {
            i.html.remove()
            mermiler.shift()
        }
    }

    mermiKontrol()
    oyunBitti()
}, 20)

arkaplanInterval = setInterval(function() {
    arkaplanlar.shift()
    arkaplanlar.push(new Arkaplan(780))
}, 14000)

engelInterval = setInterval(function() {
    const random = Math.random() * 600
    const width = Math.random() * 30 + 20
    const height = Math.random() * 30 + 20
    engeller.push(new Engel(random, width, height))
    if (engeller.length > 2) {
        engeller[0].html.remove()
        engeller.shift()
    }
}, 4000)