class Tree extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_TREE);

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);

        this.physicsComponent.collisionType = CollisionType.COLLISION_SOLID;
        this.transformComponent.absOrigin = vec3.fromValues(0, 11, 0);
    }
    onCollisionOverlap(other) {

    }
    tick(dt) {
        this.transformComponent.updateTransform();
        super.tick(dt);
    }
};

EntityType.ENTITY_TREE.construction = (owner) => {
    var globals = GlobalVars.getInstance();
    return new Tree(
        newID++,
        owner
    );
}
