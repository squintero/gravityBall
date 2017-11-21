var app={
  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    game      = null;
    gameOver  = false;

    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#f27d0c';
      game.load.image('bola', 'assets/basketnet.png');
      game.load.image('objetivo', 'assets/basketball.png');
    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '50px', fill: '#757676' });
      
      game.physics.arcade.gravity.y = 40;

      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
      bola = game.add.sprite(app.inicioX(), app.playerStartY(), 'bola');
      
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);

      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
//      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
      bola.body.allowGravity = false;

      objetivo.body.collideWorldBounds = true;
      objetivo.body.onWorldBounds = new Phaser.Signal();
      objetivo.body.onWorldBounds.add(app.endGame, this);
    }

    function update(){
      var factorDificultad = (300 + (dificultad * 50));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
    }

    var estados = { preload: preload, create: create, update: update };
    game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  endGame: function(){
    //nothing to do
    //endGame = game.add.text(0, ancho / 2, "Game Over", { fontSize: '50px', width: '100%', fill: '#757676' });
    gameOver = true;
    game.stage.backgroundColor = '#d11919';
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;
  },

  incrementaPuntuacion: function(){

    if (gameOver)
      return;

    puntuacion = puntuacion+1;
    scoreText.text = puntuacion;

    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad + 1;
    }
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return 0;
//    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  playerStartY: function(){
    return alto - DIAMETRO_BOLA - 10;
//    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 500);
    }
  },

  recomienza: function(){
    
    if (!gameOver)
      return;

    gameOver = false;
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
//    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}