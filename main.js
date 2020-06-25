// 1.Set Variable
// Explains : Window width and height variable to defined the size of the canvas
//            by getting the size of inner window and set it.

// Explains : After that i create a variable name 'main' and i fill it with an object
//            called 'canvasObject', the object will contain all the main program
//            including canvas, player, array enemy, etc.
var canvasElement = document.querySelector('#canvas'),
    context = canvasElement.getContext('2d'),
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    main = new canvasObject( { width:700,height:300 } );

// 2.Add Event Listener

window.addEventListener( 'keydown', (e) => { main.player.updateKey(e) } );
window.addEventListener( 'keyup', (e) => { main.player.updateKey(e) } );
window.addEventListener( 'keypress', (e) => { e.key == 'Enter' ? main.pause ? main.pause = false : main.pause = true : undefined } );