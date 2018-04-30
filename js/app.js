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
    assets.addModel(this.gl, TestMesh(), "test");
    assets.addModel(this.gl, GroundMesh(2000), "ground");
    assets.addModel(this.gl, TestMesh(), "wall");
    assets.addModel(this.gl, CoinMesh(), "enemy");

    assets.addTexture(this.gl, "texture0", "texture0");
    assets.addTexture(this.gl, "texture1", "texture1");
    assets.addTexture(this.gl, "texture2", "texture2");
    assets.addTexture(this.gl, "texture3", "texture3");
    assets.getModel("test").setTexture(
      assets.getTexture("texture0"),
      TestMesh().texCoords()
    );
    assets.getModel("wall").setTexture(
      assets.getTexture("texture1"),
      TestMesh().texCoords()
    )
    assets.getModel("ground").setTexture(
      assets.getTexture("texture2"),
      GroundMesh(2000).texCoords()
    );

    assets.getModel("enemy").setTexture(
      assets.getTexture("texture3"),
      CoinMesh().texCoords()
    );
    
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
    this.gameworld.player.transformComponent.absOrigin = vec3.fromValues(25, 10, 25);
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

    var maze = Maze().data();

    var spawnPos = vec2.fromValues(0, 0);
    var yaw = 0;

    for(var i = 0; i < maze.length; i++) {
      for(var j = 0; j < maze[i].length; j++) {
        switch(maze[i][j]) {
          case 0: break;
          case 1: {
            var model = (i == 0 || i == maze.length || j == 0 || j == maze[i].length) ? "wall" : "test";
            var ent = spawnEnt(i * 16, j * 16, EntityType.ENTITY_COIN, model, 20, 20, 20);
            ent.transformComponent.absOrigin[Math.Y] = 12;
            ent.physicsComponent.aabb = new AABB(ent, 16, 16, 16);
            ent.physicsComponent.aabb.translation = vec3.fromValues(4, -4, -4);
            break;
          }
          case 8: spawnPos = vec2.fromValues(i * 16, j * 16); yaw = 0; break;
          case 4: spawnPos = vec2.fromValues(i * 16, j * 16); yaw = 90; break;
          case 6: spawnPos = vec2.fromValues(i * 16, j * 16); yaw = 180; break;
          case 2: spawnPos = vec2.fromValues(i * 16, j * 16); yaw = 180; break;
          case 3: {
            var ent = spawnEnt(i * 16, j * 16, EntityType.ENTITY_TREE, "enemy", 3, 3, 3);
            ent.transformComponent.absOrigin[Math.Y] = 10;
            ent.physicsComponent.aabb = new AABB(ent, 1, 1, 1);
            ent.physicsComponent.aabb.translation = vec3.fromValues(0, 0, 0);
            break;
          }
          case 7: {
            var ent = spawnEnt(i * 16, j * 16, EntityType.ENTITY_TREE, "enemy", 3, 3, 3);
            ent.transformComponent.absOrigin[Math.Y] = 10;
            ent.physicsComponent.aabb = new AABB(ent, 1, 1, 1);
            ent.physicsComponent.aabb.translation = vec3.fromValues(0, 0, 0);
            break;
          }
          case 9: {
            var ent = spawnEnt(i * 16, j * 16, EntityType.ENTITY_TREE, "enemy", 3, 3, 3);
            ent.transformComponent.absOrigin[Math.Y] = 10;
            ent.physicsComponent.aabb = new AABB(ent, 1, 1, 1);
            ent.physicsComponent.aabb.translation = vec3.fromValues(0, 0, 0);
            break;
          }
          case 5: {
            var ent = spawnEnt(i * 16, j * 16, EntityType.ENTITY_FINISH, null, 20, 20, 20);
            ent.transformComponent.absOrigin[Math.Y] = 12;
            ent.physicsComponent.aabb = new AABB(ent, 16, 16, 16);
            ent.physicsComponent.aabb.translation = vec3.fromValues(4, -4, -4);
            console.log(i * 16, j * 16);

          }
          default: break;
        }
      }
    }

    this.gameworld.player.transformComponent.absOrigin[Math.X] = spawnPos[Math.X];
    this.gameworld.player.transformComponent.absOrigin[Math.Z] = spawnPos[Math.Y];
    this.gameworld.player.transformComponent.absRotation[Math.YAW] = yaw;


    var globals = GlobalVars.getInstance();
    globals.spawnX = spawnPos[Math.X];
    globals.spawnY = spawnPos[Math.Y];
    globals.spawnYaw = yaw;
        
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