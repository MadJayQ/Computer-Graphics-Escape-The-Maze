class GameWorld extends Entity {
    constructor() {
        super(newID++, undefined, EntityType.ENTITY_GAMEWORLD);
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_INPUT);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);

        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.inputComponent = this.getComponent(ComponentID.COMPONENT_INPUT);

        //HACK HACK(Jake): I couldn't really think of a place to put this so for now our game world will hold our scene
        //and our renderer will be responsible for processing the gameworld and rendering it's scene
        this.scene = new Scene();
        this.sceneNode = new SceneNode(this);
        this.scene.rootNode = this.sceneNode;

        this.inputComponent.registerEvent(
          InputMethod.INPUT_KEYBOARD,
          InputType.BTN_RELEASE,
          'KeyE',
          (event) => {
            this.scene.mainCameraID = ((this.scene.mainCameraID + 1) % this.scene.cameras.length);
          }
        );
        this.inputComponent.registerEvent(
            InputMethod.INPUT_KEYBOARD,
            InputType.BTN_RELEASE,
            'KeyU',
            (event) => {
              fog = !fog;
            }
        );
        this.inputComponent.registerEvent(
            InputMethod.INPUT_KEYBOARD,
            InputType.BTN_RELEASE,
            'KeyI',
            (event) => {
              plight = !plight;
            }
        );
        this.inputComponent.registerEvent(
            InputMethod.INPUT_KEYBOARD,
            InputType.BTN_RELEASE,
            'KeyO',
            (event) => {
              slight = !slight;
            }
        );
        this.inputComponent.registerEvent(
            InputMethod.INPUT_KEYBOARD,
            InputType.BTN_RELEASE,
            'KeyP',
            (event) => {
                dlight = !dlight;
            }
        );

    this.inputComponent.registerEvent(
          InputMethod.INPUT_KEYBOARD,
          InputType.BTN_RELEASE,
          'KeyQ',
          (event) => {
            this.children[0].camera.boomAngle += 30;
          }
        );
    }

    onEntityCreated(newEnt) {
        switch(newEnt.type) {
            case EntityType.ENTITY_CAMERA: //We need to add our camera to our scene
                this.scene.cameras.push(newEnt);
                break;
            default: break;
        }
        newEnt.sceneNode = new SceneNode(newEnt);
        if(newEnt.owner) {
            newEnt.sceneNode.attachTo(newEnt.owner.sceneNode);
        }
    }

    checkSpotlight() {
        var x1 = this.player.transformComponent.absOrigin[Math.X];
        var x2 = this.patroller.transformComponent.absOrigin[Math.X];
        var y1 = this.player.transformComponent.absOrigin[Math.Z];
        var y2 = this.patroller.transformComponent.absOrigin[Math.Z];
        var D = 23.0;

        return Math.pow(x1 - x2, 2.0) + Math.pow(y1 - y2, 2.0) <= Math.pow(D, 2.0);
    }

    teleportPlayer() {
        console.log(this.start.transformComponent.absOrigin);
        vec3.copy(
            this.player.transformComponent.absOrigin,
            this.start.transformComponent.absOrigin
        );
        //this.player.transformComponent.absOrigin = this.start.transformComponent.absOrigin;
        this.player.transformComponent.absOrigin[Math.Y] = 10;
    }

    tick(dt) {
        super.tick(dt);
        if(this.checkSpotlight()) {
            this.teleportPlayer();
        }
    }

    queryCollisionTree(ent, type = CollisionType.COLLISION_SOLID) {
        var collidables = [];
        var queryCollisionRecursive = (itr) =>{
            if(itr.eid != 0 && itr.eid != ent.eid) {
                if(itr.hasComponent(ComponentID.COMPONENT_PHYSICS)) {
                    var d = Math.distance(
                        ent.transformComponent.getWorldTranslation(),
                        itr.transformComponent.getWorldTranslation()
                    );
                    if(d < 20) {
                        var physicsComponent = itr.getComponent(ComponentID.COMPONENT_PHYSICS);
                        if(physicsComponent.collisionType == type) {
                            if(physicsComponent.aabb) {
                                collidables.push(physicsComponent);
                            }
                            if(physicsComponent.isMoving()) {
                                collidables.push(physicsComponent);
                            }
                        }
                    }
                }
            }
            itr.children.forEach((value, index, array) => {
                queryCollisionRecursive(value);
            });
        }
        queryCollisionRecursive(this);
        return collidables;
    }
    queryCollision() {
        var collidables = [];
        var moving = [];
        var time = Date.now();
        var queryCollisionRecursive = (ent) => {
            if(ent.hasComponent(ComponentID.COMPONENT_PHYSICS)) {
                var physicsComponent = ent.getComponent(ComponentID.COMPONENT_PHYSICS);
                if(physicsComponent.collisionType !== CollisionType.COLLISION_NONE) {
                    if(physicsComponent.aabb) {
                        collidables.push(physicsComponent);
                        if(physicsComponent.isMoving()) {
                            moving.push(physicsComponent);
                        } 
                    }
                }
            }
            ent.children.forEach((value, index, array) => {
                queryCollisionRecursive(value);
            });
        };
        queryCollisionRecursive(this);
        moving.forEach((value, index, array) => {
            collidables.forEach((nValue, nIndex, nArray) => {
                if(nValue.owner.eid != value.owner.eid) {
                    if(value.aabb.checkCollision(
                        nValue.aabb
                    ) && GlobalVars.getInstance().tickcount > 1) {
                        value.owner.onCollisionOverlap(nValue);
                        nValue.owner.onCollisionOverlap(value);
                    }
                }
            });
        });

        //time = Date.now() - time;
        //console.log("Collision took: " + time);
    }

    updateSceneGraph() {
        this.sceneNode.update();
    }

    getViewMatrix() {
        return this.scene.cameras[this.scene.mainCameraID].getComponent(ComponentID.COMPONENT_TRANSFORM).worldTransform;
    }
};
EntityType.ENTITY_GAMEWORLD.construction = () => {
    if(newID != 0) {
        console.error("Game world not root!");
        return null;
    }
    return new GameWorld();
}
