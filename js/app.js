/*
Enum type that will represent the status of our app's setup routine
Setup will be responsible for:
- Determining Screen Type
- Determining Platform (Android, PC, Etc.)
- Setup of Audio Devices
- Loading Assets

*/
var AppStatus = {
  STATUS_OK: 0, //Nice
  STATUS_CONNECTIONFAIL: 1, //Connection to host failed on any asset stream
  STATUS_MEMISSUE: 2, //Browser ran out of memory
  STATUS_BAD_BROWSER: 3, //Browser sucks (probably an iPhone)
};

class App {
  constructor() {
    this.start = 0; //The time in which the program began execution
    
    this.renderSystems = [];
    this.postRenderSystems = [];
  }
  
  /*
  Function: setup
  Parameters: void
  Purpose: Application setup routine, responsible for duties listed in above comments.
  Anything that needs to happen on page load goes here
  */
 setup() {
   // Get Canvas DOM element.
   this.canvas = $('#glcanvas')[0];
   
   // Get WebGL canvas context.
   this.gl = this.canvas.getContext('webgl');
   
   this.canvas.requestPointerLock = this.canvas.requestPointerLock || thiss.canvas.mozRequestPointerLock;
   document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
   
   this.canvas.onclick = () => {
     this.canvas.requestPointerLock();
    }
    
    
    // Ensure WebGL is working.
    if (!this.gl) {
      return AppStatus.STATUS_BAD_BROWSER;
    }
    this.renderSystems.push(
      new Renderer(this.gl)
    );
    
    //TODO(Jake): Implement resize callback handler using Observer design pattern
    var globals = GlobalVars.getInstance();
    
    // Store width and heigth in globals.
    globals.clientWidth = this.canvas.clientWidth;
    globals.clientHeight = this.canvas.clientHeight;
    
    // Set canvas size to client sizes.
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    
    
    var assets = Assets.getInstance();
    assets.addModel(this.gl, TreeMesh(), "tree");
    assets.addModel(this.gl, RockMesh(), "rock");
    assets.addModel(this.gl, CoinMesh(), "coin");
    assets.addModel(this.gl, TestMesh(), "test");
    assets.addModel(this.gl, GroundMesh(2000, 450), "ground");
    
    // Create game world entity.
    this.gameworld = new Entity.Factory(null).ofType(EntityType.ENTITY_GAMEWORLD);
    this.gameworld.meshComponent.setModel(
      assets.getModel("ground")
    );
    //this.gameworld.meshComponent.model.drawType = this.gl.LINES;
    
    // Create player entity.
    this.gameworld.player = new Entity.Factory(this.gameworld).ofType(EntityType.ENTITY_PLAYER);
    this.gameworld.player.physicsComponent.aabb = new AABB(this.gameworld.player, 5, 20, 5);
    this.gameworld.player.physicsComponent.aabb.translation[Math.Y] = 0;
    // Create camera entity.
    this.gameworld.player.camera = new Entity.Factory(this.gameworld.player).ofType(EntityType.ENTITY_CAMERA);
    this.gameworld.player.camera.boomAngle = [0, 0];
    this.gameworld.player.camera.boomRadius = 0;
    
    var entFactory = new Entity.Factory(this.gameworld);
    
    var spawnEnt = (x, y, type, model, scalex = 1, scaley = 1, scalez = 1) => {
      var ent = entFactory.ofType(type);
      ent.meshComponent.setModel(assets.getModel(model));
      ent.transformComponent.absOrigin = vec3.fromValues(x, ent.transformComponent.absOrigin[Math.Y], y);
      ent.transformComponent.absScale = vec3.fromValues(scalex, scaley, scalez);
      return ent;
    };
    
    var coin = spawnEnt(0, -10, EntityType.ENTITY_COIN, "coin", 5, 5, 5);
    coin.transformComponent.absOrigin[Math.Y] = 10;
    coin.physicsComponent.aabb = new AABB(coin, 5, 5, 5);
    coin.physicsComponent.aabb.origin = vec3.fromValues(0, 0, 0);
    coin.physicsComponent.aabb.translation = vec3.fromValues(0, 0, 0);
    coin.physicsComponent.angularVelocity[Math.YAW] = Math.randInt(30, 75);

    var wall = spawnEnt(-200, 0, EntityType.ENTITY_WALL, "test", 1, 50, 1000);
    wall.transformComponent.absOrigin[Math.Y] = 10;

    wall = spawnEnt(200, 0, EntityType.ENTITY_WALL, "test", 1, 50, 1000);
    wall.transformComponent.absOrigin[Math.Y] = 10;


    wall = spawnEnt(0, 200, EntityType.ENTITY_WALL, "test", 1, 50, 1000);
    wall.transformComponent.absOrigin[Math.Y] = 10;
    wall.transformComponent.absRotation[Math.YAW] = 90;

    wall = spawnEnt(0, -200, EntityType.ENTITY_WALL, "test", 1, 50, 1000);
    wall.transformComponent.absOrigin[Math.Y] = 10;
    wall.transformComponent.absRotation[Math.YAW] = 90;

    for(var i = 0; i < 75; i++) {
      var tx = Math.randInt(-200, 200);
      var tz = Math.randInt(-200, 200);

      var tree = spawnEnt(tx, tz, EntityType.ENTITY_TREE, "tree", 5, 5, 5);
      tree.transformComponent.absOrigin[Math.Y] = 10;
      tree.physicsComponent.aabb = new AABB(tree, 5, 25, 5);
      tree.physicsComponent.aabb.origin = vec3.fromValues(tx, 0, tz);
      tree.physicsComponent.aabb.translation = vec3.fromValues(0, 10, 0);
    }


    this.gameworld.patroller = spawnEnt(75, 0, EntityType.ENTITY_LIGHTEMITTER, "test", 50, 50, 50);
    this.gameworld.patroller.transformComponent.absOrigin[Math.Y] = 550;

    this.gameworld.start = spawnEnt(0, 195, EntityType.ENTITY_START, "test", 0, 0, 0);
    this.gameworld.finish = spawnEnt(0, -195, EntityType.ENTITY_FINISH, "test", 5, 5, 5);
    this.gameworld.finish.transformComponent.absOrigin[Math.Y] = 10;
    this.gameworld.finish.physicsComponent.aabb = new AABB(this.gameworld.finish, 5, 25, 5);
    this.gameworld.teleportPlayer();
    
    return AppStatus.STATUS_OK;
  }
  
  /*
  Function: exec
  Parameters: void
  Purpose: Begin execution of our application.
  Anything that needs to happen RIGHT before execution goes here.
  */
 exec() {
   var globals = GlobalVars.getInstance();
   globals.setTickrate(90);
   globals.timescale = 1.0;
   
   /*
   Setup input listeners here
   */
  
  //TODO(Jake): Add platform level input listening code
  requestAnimationFrame(() => this.loop());
}

/*
Function: loop
Parameters: void
Purpose: Powers the main loop of the application also manages all of the timers
ECS Subsystems will be executed from here as well
*/
loop() {
  var globals = GlobalVars.getInstance();
  var timer = Timer.getInstance();
  
  var time = timer.getCurrentTime();
  timer.updateTimers();
  
  var delta = time - globals.lasttime;
  globals.lasttime = time;
  
  //The target amount of time in milliseconds inbetween game world updates
  var targettime = globals.tickinterval * 1000;
  
  //Control the passage of time with our timescale
  delta *= globals.timescale;
  
  globals.frametime += delta;
  
  //We're going to calculate how many ticks we are about to advance, if it's really high the game thread
  // was probably sleeping and we don't need to jump a ridiculous amount of frames.
  var estimatedticks = Math.ceil(globals.frametime / targettime);
  if(estimatedticks > globals.maxtimeskip) {
    console.error("GAME WORLD ATTEMPTED TO ADVANCE: " + estimatedticks + " TICKS BUT WAS STOPPED");
    globals.frametime = 0;
  }
  
  // Check for canvas resize.
  if (this.canvas.width != this.canvas.clientWidth
    || this.canvas.height != this.canvas.clientHeight) {
      // Change canvas size.
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
      
      // Update globals width/height.
      globals.clientWidth = this.canvas.clientWidth;
      globals.clientHeight = this.canvas.clientHeight;
      
      // Update gl with viewport change.
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /*
    We want to allow the game world to advance in time as long as we have accumulated
    enough time
    */
   while(globals.frametime >= targettime) {
     globals.tickcount++;
     globals.frametime -= targettime;
     this.tick(globals.tickinterval);
    }
    
    // Update global variables.
    globals.framecount++;
    globals.curtime = time;
    globals.interpolation = globals.frametime / targettime;
    
    // Call render method.
    this.render();
    
    // Request next tick.
    requestAnimationFrame(() => this.loop());
  }
  
  /*
  Function: tick
  Parameters: dt
  Purpose: Perform logical updates on all entities and components.
  */
 tick(dt) {
   this.gameworld.tick(dt);
   this.gameworld.queryCollision();
   this.gameworld.updateSceneGraph();
  }
  
  /*
  Function: render
  Parameters: void
  Purpose: Call and perform render functions.
  */
 render() {
   /*
   All of our render systems are responsible for rendering our gameworld
   so we're gunna pass our gameworld to our render function
   */
  var gameworld = this.gameworld;
  this.renderSystems.forEach((value, index, array) => {
    value.render(gameworld);
  });
  }
  
  /*
  Run all of our post render systems
  */
}