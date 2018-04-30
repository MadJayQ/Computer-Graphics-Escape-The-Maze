class Tree extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_TREE);

        // Add entity components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);

        this.physicsComponent.collisionType = CollisionType.COLLISION_SOLID;


        this.moveSpeed = 12.0;

        this.physicsComponent.angularVelocity[Math.X] = Math.randInt(10, 20);
        this.physicsComponent.angularVelocity[Math.Y] = Math.randInt(10, 20);
    }

    onCollisionOverlap(other) {

    }

    tick(dt) {
      var playerPos = this.getGameWorld().player.transformComponent.absOrigin,
          pos = this.transformComponent.absOrigin,
          d = vec3.distance(playerPos, pos);

      if (d < 150.0) {
        var norm = vec3.create();
        vec3.subtract(norm, playerPos, pos);
        vec3.normalize(norm, norm);

        this.physicsComponent.velocity[Math.Z] = this.moveSpeed * norm[Math.Z];
        this.physicsComponent.velocity[Math.X] = this.moveSpeed * norm[Math.X];

        if(d < 5.0) {
            this.getGameWorld().player.transformComponent.absOrigin = vec3.fromValues(GlobalVars.getInstance().spawnX, 10, GlobalVars.getInstance().spawnY);
            this.getGameWorld().player.camera.transformComponent.absRotation[Math.YAW] = GlobalVars.getInstance().spawnYaw;
        }

      } else {
        this.physicsComponent.velocity[Math.Z] = 0.0;
        this.physicsComponent.velocity[Math.X] = 0.0;
      }

      this.physicsComponent.physicsSimulate(dt);
      this.transformComponent.updateTransform();
      super.tick(dt);
    }
};
EntityType.ENTITY_TREE.construction = (owner) => {
    return new Tree(
        newID++,
        owner
    );
}
