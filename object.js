//---------------------------------------------
// Im sorry if i write a dirty code
// Cause i am in a hurry for doing my homework at the end of week.
//---------------------------------------------
class canvasObject {
    constructor(prop){
        this.level = 0;
        this.pause = true;
        this.drawedPause = false;
        this.gameOver = false;
        // Set all the property.
        this.canvas = document.querySelector('#canvas');
        this.canvas.width = prop.width;
        this.canvas.height = prop.height;
        this.context = this.canvas.getContext('2d');
        // Set the player object.
        this.player = new dinosaur({
            width:45,
            height:42,
            canvas:this.canvas,
            posX:0,
            posY:this.canvas.height - 40,
            speedFrame:1
        })
        // Set the enemy array / Contains all the enemy that created or rendered.
        this.arrayEnemy = [];
        // Launched the game.
        this.render();
    }

    // Render all the object
    render(){
        this.checkHealth();
        this.addEnemy();
        if ( !this.pause ) {
            this.clearCanvas();
            this.drawBackground();
            this.drawLand();
            this.renderEnemy();
            this.player.renderLevel(this.level);
            this.player.drawSprite(this.arrayEnemy);
            this.drawedPause = false;
        } else {
            if ( !this.drawedPause ) {
                this.clearCanvas();
                this.drawBackground();
                this.drawLand();
                this.renderEnemy();
                this.player.renderLevel(this.level);
                this.player.drawSprite(this.arrayEnemy);
                this.renderPaused();
                this.drawedPause = true;
            } else {
                this.drawedPause = true;
            }
        }
        
        // Call the render function. 
        setTimeout( () => { this.render(); }, 20);
    }
    checkHealth(){
        if ( this.player.health <= 0 ) {
            this.gameOver = true;
            this.pause = true;
            this.drawedPause = false;
            this.player =  new dinosaur({
                width:45,
                height:42,
                canvas:this.canvas,
                posX:0,
                posY:this.canvas.height - 40,
                speedFrame:1
            });
            this.level = 0;
            this.arrayEnemy = [];
        }
    }
    addEnemy(){
        if ( this.arrayEnemy.length == 0 ) {
            this.level += 1;
            this.createEnemy();
            this.createEnemy();
        }
    }
    drawBackground(){
        this.context.beginPath();
        this.context.rect(0,0,this.canvas.width,this.canvas.height);
        this.context.fillStyle = '#a1a1e3';
        this.context.fill();
    }
    drawLand(){
        this.context.beginPath();
        this.context.rect(0,280,this.canvas.width,5);
        this.context.fillStyle = '#1a1a2a';
        this.context.fill();
    }
    renderPaused(){
        var text;
        this.gameOver ? text = 'GameOver' : text = 'Paused Game';
        this.context.beginPath();
        this.context.textAlign = "center";
        this.context.font = '20px pixelFont';
        this.context.fillStyle = '#ffffff';
        this.context.fillText(text,this.canvas.width / 2, this.canvas.height / 2 - 30);
        this.context.font = '20px pixelFont';
        this.context.fillStyle = '#ffffff';
        this.context.fillText('Press Enter To Start or Continue',this.canvas.width / 2, this.canvas.height / 2);
        this.context.fill();
    }
    createEnemy(){
        var posX = this.canvas.width / 1 * Math.random() 
        var newEnemy = new enemy({
            width:45,
            height:42,
            speedFrame:5,
            posX: posX > this.player.posX ? posX += 20 : posX -= 20,
            posY:240,
            context:this.context,
            level:this.level
        });
        this.arrayEnemy.push(newEnemy);
    }
    renderEnemy(){
        var loopLength = this.arrayEnemy.length;
        for ( var i = 0; i < loopLength; i++ ) {
            var index = this.arrayEnemy[i];
            index.render(this.player);
        }
    }

    clearCanvas(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height); 
    }
}

class enemy{
    constructor(prop){
        // Define the canvas and context
        this.context = prop.context;
        // Define the width and height
        this.width = prop.width;
        this.height = prop.height;
        // Define the frame property
        this.tickCount = 0;
        this.tickTotal = prop.speedFrame;
        this.frameIndex = 0;
        this.frameMax = 7;
        // Get the image sprite
        this.image = new Image(); this.image.src = './assets/sprite/SlimeMonster.png';
        // Define the possition object
        this.posX = prop.posX;
        this.posY = prop.posY - 1;
        // Define the speed variable
        this.velocityX = 0;
        this.velocityY = 0;
        // ETC
        this.maxHealth = 100 * prop.level;
        this.health = this.maxHealth;
        this.damage = 5 * prop.level;
        this.after = false;
        this.before = false;
    }

    updatePosition(prop){
        var playerX = prop.posX,
            playerY = prop.posY;

        if ( this.posX < playerX ) {
            this.velocityX += 1;
        } else if ( this.posX > playerX + 45 ) {
            this.velocityX -= 1;
        }

        this.posX += this.velocityX;

        if ( this.posX > playerX - 45 && prop.touchGround == true && this.after == false ) {
            this.posX = playerX - 45;
            if ( prop.attacked == false ) {
                prop.health -= this.damage;
                prop.attacked = true;
            }
            if ( prop.timeout == false ) {
                prop.timeout = true;
                setTimeout( (e) => {  
                    if ( prop.attacked ) {
                        prop.attacked = false;
                        prop.timeout = false
                    }
                }, 500);
            } 
        }

        if ( this.posX < playerX + prop.width && this.after == true && prop.touchGround == true ) {
            this.posX = playerX + prop.width;
            if ( prop.attacked == false ) {
                prop.health -= this.damage;
                prop.attacked = true;
            }
            if ( prop.timeout == false ) {
                prop.timeout = true;
                setTimeout( (e) => {  
                    if ( prop.attacked ) {
                        prop.attacked = false;
                        prop.timeout = false
                    }
                }, 500);
            } 
        }

        this.velocityX = 0;
    }

    updateFrame(){
        this.tickCount += 1;
        if ( this.tickCount > this.tickTotal ) {
            this.tickCount = 0;
            this.frameIndex >= this.frameMax ? this.frameIndex = 0 : this.frameIndex += 1;
            this.frameX = this.width * this.frameIndex;
        }
    }

    defineAfterAndBefore(prop){
        if ( this.posX < prop.posX  ) {
            this.after = false;
        } else if ( this.posX > prop.posX + 45 ) {
            this.after = true;
        }
    }

    renderHealth(){
        // Behind the bar health
        this.context.beginPath();
        this.context.rect( this.posX + 3,this.posY + 10, this.width - 5, 5 );
        this.context.fillStyle = '#ff4040';
        this.context.fill();

        // Calculate the bar health
        var greenBarHealth = this.health / this.maxHealth,
            greenBarHealth = greenBarHealth * ( this.width - 5 );

        // Render the health
        this.context.beginPath();
        this.context.rect( this.posX + 3,this.posY + 10, greenBarHealth, 5 );
        this.context.fillStyle = '#c1ffc1';
        this.context.fill();
    }

    render(prop){
        this.defineAfterAndBefore(prop);
        this.updatePosition(prop);
        this.updateFrame();
        this.renderHealth();
        this.context.drawImage( this.image, this.frameX, 0, this.width, this.height, this.posX, this.posY, this.width, this.height );
    }

}

class dinosaur{
    constructor(prop){
        this.health = 100;
        // Set all the property of dinosaur object.
        this.width = prop.width; 
        this.height = prop.height;
        this.canvas = prop.canvas;
        this.context = this.canvas.getContext('2d');
        // Set all the frame property.
        this.frameIndex = 0;
        this.frameTotal = 1;
        this.tickCount = 0;
        this.tickTotal = 0;
        this.speedFrame = prop.speedFrame;
        this.frameX = 0;
        this.frameY = 0;
        // Set the image sprite.
        this.sprite = new Image();
        this.sprite.src = './assets/sprite/Dinosaurs-Sprite.png';
        // Set the position of the dinosaur.
        this.posX = prop.posX;
        this.posY = prop.posY;
        this.land = this.canvas.height - 60;
        this.velocityX = 0;
        this.velocityY = 0;
        this.maxLeft = -5;
        this.maxRight = this.canvas.width - 45;
        // Set all the action property
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.touchGround = false;
        this.attack = false;
        this.touchGround = true; // default true, cause the object touch the ground first
        this.sideLeft = false;
        this.sideRight = true; // default true, cause the object spawn and face to the right side
        this.lastAction = false;
        this.attackReady = false;
        this.attacked = false;
        this.timeout = false;
        // Set the bullet or ball array
        this.arrayBall = [];
        this.score = 0;
    }
    updateSideAndFrame(e){
        this.lastAction = e;
        this.updateSide();
        this.updateFrameIndex();
        this.updateFrameMax();
        this.updateFrameYandTick();
    }
    updateKey(e){
        // Check the type of the event is it keydown or keyup
        var keyState = ( e.type == 'keydown' ) ? true : false ,
            key = e.key;

        e.type == 'keyup' && key == 'a' && this.attack && this.frameIndex !== 3 ? this.removeBall() : undefined;
        e.type == 'keyup' && key == 'a' && this.attack && this.frameIndex == 3 ? this.moveBall() : undefined;
       
        // Check what key that being pressed or up
        key == 'ArrowUp' ? this.up = keyState : undefined ;
        key == 'ArrowDown' ? this.down = keyState : undefined ;
        key == 'ArrowLeft' ? this.left = keyState : undefined ;
        key == 'ArrowRight' ? this.right = keyState : undefined ;
        key == 'a' || key == 'A' ? this.attack = keyState : undefined;

        this.up == true && this.jump == true ? this.lastAction = false : undefined ;

        // Check what key that being pressed or up
        e.type == 'keydown' && key == 'a' && this.attack && this.attackReady == false && this.lastAction == false ? this.appendBall({left:this.sideLeft,right:this.sideRight}) : undefined ;
        !this.lastAction ? this.updateSideAndFrame(true) : undefined ;
        // Reset the last action
        e.type == 'keyup' && this.attack == false ? this.updateSideAndFrame(false) : undefined;
        e.type == 'keyup' && key == 'a' && this.attackReady ? this.attackReady = false : undefined;
        e.type == 'keydown' && key == 'a' && this.attack && this.frameMax > 3 ? this.updateSideAndFrame(true) : undefined;
        
        keyState == true ? this.debugAction() : undefined ; // Just for debugging the action property
        keyState == true ? this.debugFrame() : undefined; // Just for debugging the frame property
    }
    updateFrame(){
        
        if ( this.sideRight ) {
            this.tickCount += this.speedFrame;
            if ( this.tickCount > this.tickTotal ) {
                this.tickCount = 0;
                // Check if the attack no on the condition true
                if ( this.attack !== true ) {
                    this.frameIndex < this.frameMax ? this.frameIndex += 1 : this.frameIndex = 0 ;
                } else {
                    this.frameIndex < this.frameMax ? this.frameIndex += 1 : this.frameIndex =  3;
                    this.attackReady = true;
                }
            }
            this.frameX = 0 + ( this.width * this.frameIndex );

        }
        if ( this.sideLeft ) {
            this.tickCount += this.speedFrame;
            if ( this.tickCount > this.tickTotal ) {
                this.tickCount = 0;
                // Check if the attack no on the condition true
                if ( this.attack !== true ) {
                    this.frameIndex < this.frameMax ? this.frameIndex += 1 : this.frameIndex = 0 ;
                } else {
                    console.log('test');
                    if ( this.frameIndex < this.frameMax && this.attack ) {
                        this.frameIndex += 1;
                    } else {
                        this.frameIndex =  3;
                        this.attackReady = true;
                    }
                }
            }
            this.frameX = ( this.width * this.frameMax ) - ( this.width * this.frameIndex );
        }

        // this.debugFrame(); // Just for debugging the frame property
    }
    updatePosition(prop){
        this.updateVelocity();

        // gravity mean the object will fall if he's jump 
        this.attack == true ? undefined : this.velocityY += 0.95;  
        // calculate the position of the object to movement or speed
        this.posX += this.velocityX;
        this.posY += this.velocityY;
        // keep the velocity to zero
        this.velocityX *= 0.9;
        this.attack == true ? undefined : this.velocityY *= 0.9;

        this.updateCollision(prop);
    }
    drawSprite(prop){
        this.updatePosition(prop);
        this.updateFrame();
        this.renderHealth();
        this.renderBall(prop);
        this.renderScore();
        this.context.drawImage(this.sprite,this.frameX,this.frameY,this.width,this.height,this.posX,this.posY,this.width,this.height);
    }
    debugAction(){
        console.clear();
        console.log('---------Debug Action-------');
        console.log('left          : ' + this.left);
        console.log('right         : ' + this.right);
        console.log('up            : ' + this.up);
        console.log('down          : ' + this.down);
        console.log('jump          : ' + this.jump);
        console.log('attack        : ' + this.attack);
        console.log('attackReady   : ' + this.attackReady);
        console.log('sideRight     : ' + this.sideRight);
        console.log('sideLeft      : ' + this.sideLeft);
        console.log('touchGround   : ' + this.touchGround);
        console.log('lastAction    : ' + this.lastAction);
        console.log('arrayBall     : ' + this.arrayBall.length);
    }
    debugFrame(){
        console.log('-------Debug Frame-------');
        console.log('frameIndex : ' + this.frameIndex) ;
        console.log('frameMax   : ' + this.frameMax);
        console.log('tickCount  : ' + this.tickCount);
        console.log('tickTotal  : ' + this.tickTotal);
        console.log('frameX     : ' + this.frameX);
    }
    updateCollisionEnemy(prop){
    var loopLength = prop.length;
    for ( var i = 0; i < loopLength; i++ ) {
        var index = prop[i];
        if ( this.posX < index.posX + 45 && this.jump !== true && index.after == false ) {
            this.posX = index.posX + 45;
            if ( this.attacked == false ) {
                this.health -= index.damage;
                this.attacked = true;
            }
            if ( this.timeout == false ) {
                this.timeout = true;
                setTimeout( (e) => {  
                    if ( this.attacked ) {
                        this.attacked = false;
                        this.timeout = false
                    }
                }, 500);
            } 
        }  
        if ( this.posX + 45 > index.posX && this.jump !== true && index.after == true ) {
            this.posX = index.posX - 45;
            if ( this.attacked == false ) {
                this.health -= index.damage;
                this.attacked = true;
            }
            if ( this.timeout == false ) {
                this.timeout = true;
                setTimeout( (e) => {  
                    if ( this.attacked ) {
                        this.attacked = false;
                        this.timeout = false
                    }
                }, 500);
            } 
        }
    }
    }
    updateVelocity(){
        if ( this.left && !this.up ) {
            this.velocityX = this.velocityX -= 0.7;
        } 
        if ( this.left && this.up ){
           this.velocityX = this.velocityX -= 0.3;
        }
        if ( this.right && this.up ){
           this.velocityX = this.velocityX += 0.3;
        }
        if ( this.right && !this.up ) {
            this.velocityX = this.velocityX += 0.7;
        }
        if ( this.up && !this.jump && !this.touchGround && this.frameIndex == 3 ) {
            this.velocityY = this.velocityY -= 20;
            this.jump = true;
        }
        if ( this.down ) {
            this.velocityY = this.velocityY += 0.3;
        }
        if ( this.attack ) {
            this.velocityY = 0;
            this.velocityX = 0;
        }
        if ( this.left && this.jump && !this.touchGround ) {
            this.velocityX = this.velocityX -= 0.5;
        }
        if ( this.right && this.jump && !this.touchGround ) {
            this.velocityX = this.velocityX += 0.5;
        }
    }
    updateCollision(prop){
        // Condition when player above the land
        if ( this.posY > this.land ) {
            this.posY = this.land;
            this.velocityY = 0;
            this.touchGround = true;
            // Delay the jump
            if ( this.touchGround && this.up ){
                this.touchGround = true;
                this.frameIndex  < 3 ? this.touchGround = false : this.touchGround = true ;
            }
            // Reset the last action
            if ( this.jump == true && this.frameIndex < 3 ) {
                this.jump = false;
                this.touchGround = true;
                this.lastAction = false;
            }
            if ( this.jump == true && this.up == false ) {
                this.jump = false;
                this.touchGround = true;
                this.lastAction = false;
            }
            if ( this.jump == false && this.right && this.frameY !== 84 && this.up == false ) {
                this.updateSideAndFrame(false)
            }
            if ( this.jump == false && this.left && this.frameY !== 126 && this.up == false ) {
                this.updateSideAndFrame(false)
            }
        }
        // Collition left 
        if ( this.posX < this.maxLeft ) {
            this.posX = this.maxLeft;
        }
        // Collition right
        if ( this.posX > this.maxRight ) {
            this.posX = this.maxRight;
        }
        this.updateCollisionEnemy(prop);
    }
    updateSide(){
        if ( this.left && this.attack == false ) {
            this.sideLeft = true;
            this.sideRight = false;
        } else if ( this.right && this.attack == false ) {
            this.sideLeft = false;
            this.sideRight = true;
        }
    }
    updateFrameIndex(){
        if ( this.sideRight ) {
            this.frameIndex = 0;
        }
        if ( this.sideLeft ) {
            this.frameIndex = 0;
        }
    }
    updateFrameMax(){
        if ( this.sideRight ) {
            this.frameMax = 7;

            if ( this.right && !this.up ) {
                this.frameMax = 5;
            }
            if ( this.up ) {
                this.frameMax = 3;
            }
            if ( this.attack ) {
                this.frameMax = 3;
            }
        }
        if ( this.sideLeft ) {
            this.frameMax = 7;

            if ( this.left && !this.up ) {
                this.frameMax = 5;
            }
            if ( this.up ) {
                this.frameMax = 3;
            }
            if ( this.attack ) {
                this.frameMax = 3;
            }
        }
    }
    updateFrameYandTick(){
        if ( this.sideRight ) {
            this.frameY = 0;
            this.tickTotal = 5;
            if ( this.right && !this.jump ) {
               this.frameY = this.height * 2;
               this.tickTotal = 3.5;
            }
            if ( this.up ) {
                this.frameY = this.height * 4;
                this.tickTotal = 10;
            }
            if ( this.attack ) {
                this.frameY = this.height * 6;
                this.tickTotal = 10;
            }
        }
        if ( this.sideLeft ) {
            this.frameY = this.height * 1;
            this.tickTotal = 5;
            if ( this.left && !this.jump ) {
                this.frameY = this.height * 3;
                this.tickTotal = 3.5;
             }
             if ( this.up ) {
                 this.frameY = this.height * 5;
                 this.tickTotal = 10;
             }
             if ( this.attack ) {
                 this.frameY = this.height * 7;
                 this.tickTotal = 10;
             }
        }
    }
    appendBall(prop){
        var ball = new ballObject({
            canvas:this.canvas,
            posX:prop.left ? this.posX - 20 : this.posX + 35 ,
            posY:this.posY - 3,
            sideLeft:prop.left,
            sideRight:prop.right
        });
        this.arrayBall.push(ball);
        console.log('added ball');
    }
    removeBall(){
        var lastBall = this.arrayBall.length - 1;

        console.log(lastBall);
        this.arrayBall.splice(lastBall,1);
    }
    renderBall(prop){
        var loopLength = this.arrayBall.length - 1;
        for (let i = 0; i <= loopLength; i++ ) {
            var index = this.arrayBall[i],
                removeCond = false,
                enemyLength =  prop.length;

            if ( index.posX == index.leastX || index.posX == index.maxX ) {
                removeCond = true;
            }

            for (let j = 0; j < enemyLength; j++ ) {
                var indexEnemy = prop[j],
                    removeEnemy = false;
                
                if ( index.frameIndex == 4 && index.posX + index.width > indexEnemy.posX && index.posX + index.width < indexEnemy.posX + indexEnemy.width && index.posY >= this.land - 10 ) {
                    removeCond = true;
                    removeEnemy = true;   
                    indexEnemy.posX += 20;                 
                }

                if ( index.frameIndex == 4 && index.posX < indexEnemy.posX + indexEnemy.width && index.posX > indexEnemy.posX && index.posY >= this.land - 10 ) {
                    removeCond = true;
                    removeEnemy = true;   
                    indexEnemy.posX -= 20;
                }

                if ( removeEnemy ) {
                    indexEnemy.health -= index.damage;
                    if ( indexEnemy.health <= 0 ) {
                        prop.splice( j,j+1 );
                        enemyLength -= 1;
                        j -= 1;
                        this.score += 100
                        console.log('test');
                    }
                    break;
                }
            }

            if ( removeCond ) {
                this.arrayBall.splice( i,i+1 );
                loopLength -= 1;
                i -= 1;
            } else {
                index.render();
            }

        }
    }
    moveBall(){
        try {
            var loopLength = this.arrayBall.length - 1;
            var index = this.arrayBall[loopLength];
            index.frameIndex = 4;
        } catch {
            console.log('tidak ada biji');
        }
    }
    renderHealth(){
        //Render the behind bar
        this.context.beginPath();
        this.context.rect(10,15,120,12);
        this.context.fillStyle = '#ff4040';
        this.context.fill();

        // Calculate the green bar
        var greenBar = this.health / 100,
            greenBarWidth = greenBar * 120,
            greenBar = greenBar * 100;

        //Render the behind bar
        this.context.beginPath();
        this.context.rect(10,15,greenBarWidth,12);
        this.context.fillStyle = '#c1ffc1';
        this.context.fill();

        // Draw Text
        this.context.beginPath();
        this.context.font = '18px pixelFont';
        this.context.textAlign = "left";
        this.context.fillText(String(greenBar) + '%',135,28,100);
        this.context.fill();
    }
    renderScore(){
        this.context.beginPath();
        this.context.textAlign = "right";
        this.context.fillText(this.score,this.canvas.width - 10, 25);
        this.context.fill();
    }
    renderLevel(level){
        this.context.beginPath();
        this.context.textAlign = "center";
        this.context.font = '18px pixelFont';
        this.context.fillStyle = '#c1ffc1';
        this.context.fillText(level,this.canvas.width / 2, 25);
        this.context.fill();
    }
}

class ballObject{
    constructor(prop){
        this.posX = prop.posX;
        this.posY = prop.posY;
        this.sideLeft = prop.sideLeft;
        this.sideRight = prop.sideRight;
        this.frameMax = 4;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.tickTotal = 10;
        this.width = 45;
        this.height = 42;
        this.frameX = 0;
        this.frameY = 0;
        this.image = new Image();
        this.image.src = './assets/sprite/Attack-Ball.png';
        this.canvas = prop.canvas;
        this.context = this.canvas.getContext('2d');
        this.velocityX = 0;
        this.maxX = this.canvas.width - 20;
        this.leastX = -5;
        this.damage = 30 * main.level - 10;
    }
    updatePosition(){
        if ( this.frameIndex == 4 && this.sideLeft ) {
            this.velocityX -= 0.1;
        } else if ( this.frameIndex == 4 && this.sideRight ) {
            this.velocityX += 0.1;
        }

        this.posX += this.velocityX;
        this.velocity = 0;

        // collision
        if ( this.posX > this.maxX ) {
            this.posX = this.maxX;
        }
        if ( this.posX < this.leastX ) {
            this.posX = this.leastX;
        }
    }
    updateFrame(){
        if ( this.frameIndex < 3 ) {
            this.tickCount += 1;
            if ( this.tickCount > this.tickTotal ) {
                this.tickCount = 0;
                this.frameIndex += 1;
                this.frameX = this.width * this.frameIndex;
            }
        }
    }
    render(){
        this.updateFrame();
        this.frameIndex == 4 ? this.updatePosition() : undefined;
        this.context.drawImage(this.image,this.frameX,this.frameY,this.width,this.height,this.posX,this.posY,this.width - 15,this.height - 15);
    }
}