var MoveDirection = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
}

var PortalType = {
  NONE: 0,
  LEFT: 1,
  RIGHT: 2,
  BOTH: 3
}

class Player extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_PLAYER);

        // Define directional movement conditions.
        this.movement = {};
        this.movement[MoveDirection.UP] = false;
        this.movement[MoveDirection.DOWN] = false;
        this.movement[MoveDirection.LEFT] = false;
        this.movement[MoveDirection.RIGHT] = false;

        // Assign movement control key codes.
        this.controls = {
          keyLeft: 'KeyA',
          keyRight: 'KeyD',
          keyUp: 'KeyW',
          keyDown: 'KeyS'
        };

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_INPUT);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.inputComponent = this.getComponent(ComponentID.COMPONENT_INPUT);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.physicsComponent.collisionType = CollisionType.COLLISION_SOLID;

        this.transformComponent.absOrigin[Math.Y] = 10;
        this.accumulatedMouseDelta = vec2.fromValues(0, 0);
        this.rotationSpeed = 15;
        

        /*
        this.inputComponent.registerEvent(
          InputMethod.INPUT_KEYBOARD,
          InputType.BTN_PRESS,
          'KeyA',
          (event) => {
            this.children[0].transformComponent.absOrigin[Math.X] -= 0.1;
          }
        );

        */

        // Register movement callbacks.
        this.inputComponent.registerKeyboardEvent(
          'KeyD',
          (event) => {
            this.movement[MoveDirection.RIGHT] = true;
          },
          (event) => {
            this.movement[MoveDirection.RIGHT] = false;
          }
        );

        this.inputComponent.registerKeyboardEvent(
          'KeyA',
          (event) => {
            this.movement[MoveDirection.LEFT] = true;
          },
          (event) => {
            this.movement[MoveDirection.LEFT] = false;
          }
        );

        this.inputComponent.registerKeyboardEvent(
          'KeyW',
          () => {
            this.movement[MoveDirection.UP] = true;
          },
          () => {
            this.movement[MoveDirection.UP] = false;
          }
        );

        this.inputComponent.registerKeyboardEvent(
          'KeyS',
          () => {
            this.movement[MoveDirection.DOWN] = true;
          },
          () => {
            this.movement[MoveDirection.DOWN] = false;
          }
        );

        this.inputComponent.registerEvent(
            InputMethod.INPUT_MOUSE,
            InputType.MSE_MOVE,
            null,
            (event) => { this.onMouseMove(event); }
        )
    }

    onMouseMove(event) {
      
      var dX = event.movementX;
      var dY = event.movementY;

      this.accumulatedMouseDelta[Math.X] += dX;
      this.accumulatedMouseDelta[Math.Y] += dY;
    }

    processMovement(dt) {
      var leftMove = 0;
      var forwardMove = 0;
      if(this.movement[MoveDirection.DOWN]) forwardMove += 450;
      if(this.movement[MoveDirection.UP]) forwardMove -= 450;
      if(this.movement[MoveDirection.LEFT]) leftMove += 450;
      if(this.movement[MoveDirection.RIGHT]) leftMove -= 450;

      this.transformComponent.absRotation[Math.YAW] -= (this.accumulatedMouseDelta[Math.X] * dt) * this.rotationSpeed;
      this.transformComponent.absRotation[Math.PITCH] -= (this.accumulatedMouseDelta[Math.Y] * dt) * this.rotationSpeed;

      var pitch = this.transformComponent.absRotation[Math.PITCH];
      var yaw = this.transformComponent.absRotation[Math.YAW];

      var cos = Math.cos;
      var sin = Math.sin;
      var view = this.transformComponent.absRotation;
      var forwardVector = vec3.fromValues(0, 0, 0);
      var sideVector = vec3.fromValues(0, 0, 0);
      var upVector = vec3.fromValues(0, 0, 0);

      Math.angleVectors(view, forwardVector, sideVector, upVector);

      forwardVector[Math.Z] = 0;
      sideVector[Math.Z] = 0;

      this.physicsComponent.velocity[Math.X] = (forwardVector[Math.Y] * forwardMove) + (sideVector[Math.Y] * leftMove);
      this.physicsComponent.velocity[Math.Z] = (forwardVector[Math.X] * forwardMove) + (sideVector[Math.X] * leftMove);
      this.physicsComponent.velocity[Math.Y] = (forwardVector[Math.Z] * forwardMove) + (sideVector[Math.Z] * leftMove);

      this.accumulatedMouseDelta = vec2.fromValues(0, 0);
    }
    
    onCollisionOverlap(other) {
      if(other.owner.type == EntityType.ENTITY_COIN) {
        other.owner.destroy();
      }
    }

    tick(dt) {
        //this.physicsComponent.velocity[Math.Z] = Math.lerp(this.physicsComponent.velocity[Math.Z], -200, 0.00001);
        this.processMovement(dt);
        this.physicsComponent.physicsSimulate(dt);
        this.transformComponent.updateTransform();
        super.tick(dt);
    }
};

EntityType.ENTITY_PLAYER.construction = (owner) => {
    var globals = GlobalVars.getInstance();
    return new Player(
        newID++,
        owner
    );
}
