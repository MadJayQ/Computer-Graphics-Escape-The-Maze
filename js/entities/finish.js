class Finish extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_FINISH);

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);

        this.physicsComponent.collisionType = CollisionType.COLLISION_TRIGGER;

        this.once = false;
    }

    onCollisionOverlap(other) {
        if(!this.once) {
            this.once = true;
            document.write("YOU WIN");
        }
    }

    tick(dt) {
        this.physicsComponent.physicsSimulate(dt);
        this.transformComponent.updateTransform();
        super.tick(dt);
    }
};

EntityType.ENTITY_FINISH.construction = (owner) => {
    var globals = GlobalVars.getInstance();
    return new Finish(
        newID++,
        owner
    );
}
