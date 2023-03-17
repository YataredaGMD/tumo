// function myFunc(string){                         
//     return(string.slice(1, -1))                   
// }                                                
// console.log(myFunc('I`m always come back')) 

// function youFunc(name){
//     let nameArr = name.split(' ')
//     nameArr[0] = nameArr[0].slice(0, 1 )
//     nameArr[1] = nameArr[1].slice(0, 1)
    
//     return nameArr = nameArr.join('. ')
// }
// console.log(youFunc('Michael Jackson'))

// function wasFunc(word) {
//     let array = word.split('')
//     array = array.reverse()
//     array = array.join('')
//     if(word == array){
//         console.log('true')
//     }
//     else{
//         console.log('false')  
//     }
// }

// wasFunc('Алла')

// function theyFunc(array) {
//     let mas = false
//     let arr = []
//     for(let i = 0; i < array.length; i++){
//         mas = arr.includes(array[i])
//         if(mas == false){
//             arr.push(array[i])
//         }
//     }
//     return arr
// }

// console.log(theyFunc([9, 5, 7, 2, 5, 7]))











// // Задание номер 1: 
// function herFunc(a, b, c) {
//     return y = -4 * a*a - 8/b + 5 * c
// }

// console.log(herFunc(-3, 2, 4))

// // Задание номер 2:

// function yourFunc() {
//     let mas = []
//     for(let i = -50; i < 150; i++){
//         if(i%5 == 0){
//             mas.push(i)
        
//          } 
//     }
      
// }

// console.log(yourFunc())

// // Задание номер 3:

// function yourFunc(min, max) {
//     return Math.round(Math.random() * (max - min) + min)
//   }
//  console.log(yourFunc(1, 50))








function setup() {
    createCanvas(400, 400);
    Game.addCommonBalloon()
    }
// создаем канвас, и спавним первый шарик, что бы не было задержки после рестарта

function draw () {

    background('skyblue')

    for (let balloon of Game.balloons) {

        balloon.display()
        balloon.move(Game.score)

        if (balloon.y <= balloon.size / 2 && balloon.color != 'black' && balloon.color != 'red' && balloon.color != 'green') {
            noLoop()
            clearInterval(interval)
            Game.balloons.length = 0        
            let finalScore = Game.score
            Game.score = ' '
            background(220, 20, 60)
            textSize(64)
            fill('white')
            textAlign(CENTER, CENTER)
            text('YOU LOSER', 200, 200)
            textSize(32)
            text('Your score: ' + finalScore, 200, 300)
        }
    }

    if(frameCount % 70 === 0) {
        Game.addCommonBalloon()
    }

    if(frameCount % 100 === 0) {
        Game.addUncommonBalloon()
    }
    
    if(frameCount % 110 === 0) {
        Game.addAngryBalloon()
    }

    if(frameCount % 300 === 0) {
        Game.addBombBalloon()
    }

    textSize(32);
    fill('black');
    text(Game.score, 20, 40);
}

// здесь мы отрисовываем всякие бэкграунды, надписи, выводим шарики на экран, и проверяем конец игры

let interval = setInterval(() =>{
    Game.sendStatistics()
}, 5000);

class Game {
    static balloons = []
    static score = 0
    static countOfGreen = 0
    static countOfBlack = 0
    static countOfBlue = 0
    static countOfClick = 0

    static sendStatistics() {
        let stats = {
            countOfGreen: this.countOfGreen,
            countOfBlack: this.countOfBlack,
            countOfBlue: this.countOfBlue,
            countOfClick: this.countOfClick,
        }

        fetch('/stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stats)
        });
    }

    static addCommonBalloon() {
        let commonBalloon = new CommonBalloon('blue', 50);
        this.balloons.push(commonBalloon);
    }

    static addUncommonBalloon() {
        let uncommonBalloon = new UncommonBalloon('green', 30);
        this.balloons.push(uncommonBalloon);
    }

    static addAngryBalloon() {
        let angryBalloon = new AngryBalloon('black', 60);
        this.balloons.push(angryBalloon);
    }

    static addBombBalloon() {
        let bombBalloon = new BombBalloon('red', 20);
        this.balloons.push(bombBalloon);
    }

    static checkIfBalloonBurst() {
        this.balloons.forEach((balloon, index) => {
            let distance = dist(balloon.x, balloon.y, mouseX, mouseY);
            if(distance <= balloon.size / 2) {
                balloon.burst(index)
            }
        })
    }
} 

// тут у нас находится счёт, массив с шариками, их хар-ками, и делаем их кликабельными

function mousePressed() {
    if (!isLooping()) {
        loop()
        Game.score = 0
        Game.countOfBlack = 0
        Game.countOfBlue = 0
        Game.countOfGreen = 0
        Game.countOfClick = 0

        interval = setInterval(() =>{
            Game.sendStatistics()
        }, 5000);
    }
    Game.checkIfBalloonBurst()
    Game.countOfClick += 1
}

// делаем возможным рестарт, и запускаем метод для нажатий по шарикам

class CommonBalloon {
    constructor(color, size) {
        this.x = random(width);
        this.y = random(height - 10, height + 50);
        this.color = color
        this.size = size
    }

    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.size)
        line(this.x, this.y + this.size / 2, this.x, this.y + 2 * this.size,)
    }

    move(score) {
        if (score < 100) {
            this.y -= 1
        } else if (score >= 100 && score <= 200) {
            this.y -= 2
        } else if (score >= 200 && score <= 300) {
            this.y -= 3
        } else {
            this.y -= 4
        }
    }

    burst(index) {
        Game.balloons.splice(index, 1)
        Game.score += 1
        Game.countOfBlue += 1
    }
}

class UncommonBalloon extends CommonBalloon {
    constructor(color, size) {
       super(color, size)
    }

    burst(index) {
        Game.balloons.splice(index, 1)
        Game.score += 15
        Game.countOfGreen += 1
    }
}

class AngryBalloon extends CommonBalloon {
    constructor(color, size) {
       super(color, size)
    }

    burst(index) {
        Game.balloons.splice(index, 1)
        Game.score -= 10
        Game.countOfBlack += 1
    }
}

class BombBalloon extends CommonBalloon {
    constructor(color, size) {
       super(color, size)
    }

    burst(index) {
        Game.balloons.splice(index, 1)
        Game.balloons = []
    }
}
//тут у нас находятся виды шариков, и их методы
