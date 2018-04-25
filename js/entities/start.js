class Start extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_START);

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);

        this.physicsComponent.collisionType = CollisionType.COLLISION_TRIGGER;
    }

    onCollisionOverlap(other) {

    }

    tick(dt) {
        this.physicsComponent.physicsSimulate(dt);
        this.transformComponent.updateTransform();
        super.tick(dt);
    }
};

EntityType.ENTITY_START.construction = (owner) => {
    var globals = GlobalVars.getInstance();
    return new Start(
        newID++,
        owner
    );
}
