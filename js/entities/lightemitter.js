class LightEmitter extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_LIGHTEMITTER);

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);
        
        this.physicsComponent.collisionType = CollisionType.COLLISION_SOLID;

        this.physicsComponent.velocity[Math.X] = 15;
        this.physicsComponent.onBoundary = (axis) => {
            this.physicsComponent.velocity[axis] *= -1;
        }

        this.nextPatrolTime = 0;
    }

    onCollisionOverlap(other) {

    }

    patrol() {
        if(GlobalVars.getInstance().curtime > this.nextPatrolTime) {
            console.log("Changing directions!");
            this.nextPatrolTime = GlobalVars.getInstance().curtime + 5000;
            var playerPos = this.getGameWorld().player.transformComponent.absOrigin;
            var pos = this.transformComponent.absOrigin;
            var dir = vec3.fromValues(0, 0, 0);
            vec3.subtract(dir, playerPos, pos);
            vec3.normalize(dir, dir);
            this.physicsComponent.velocity[Math.X] = dir[Math.X] * 500;
            this.physicsComponent.velocity[Math.Z] = dir[Math.Z] * 500;
        }
    }

    tick(dt) {
        this.patrol();
        this.physicsComponent.physicsSimulate(dt);
        this.transformComponent.updateTransform();
        super.tick(dt);
    }
};

EntityType.ENTITY_LIGHTEMITTER.construction = (owner) => {
    var globals = GlobalVars.getInstance();
    return new LightEmitter(
        newID++,
        owner
    );
}
