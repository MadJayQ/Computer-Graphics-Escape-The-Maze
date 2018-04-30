/*
    Renderer class
    A renderer object will be responsible for rendering a scene
    A renderer object should be able to be extended for more specific use
*/
var z = 0;
class Renderer {
    constructor(glContext) {
        this.ctx = glContext;
        this.program = new Program.Builder(glContext).
               withShader("assets/shaders/vertex.glsl", glContext.VERTEX_SHADER, "VERTEX").
               withShader("assets/shaders/fragment.glsl", glContext.FRAGMENT_SHADER, "FRAGMENT").
               build();
    }
    clear(color = BLACK) {
        this.ctx.clearColor(color.r, color.g, color.b, color.a);
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    }

    recursiveRender(ent) {
      // Render entity's mesh if it exists.
      if (ent.hasComponent(ComponentID.COMPONENT_MESH)) {
          ent.components[ComponentID.COMPONENT_MESH].render(this.program, this.ctx);
      }

      if(ent.hasComponent(ComponentID.COMPONENT_PHYSICS) && drawAABB) {
          var physicsComponent = ent.getComponent(ComponentID.COMPONENT_PHYSICS);
          if(physicsComponent.aabb) {
              physicsComponent.aabb.draw(this.program, this.ctx);
          }
      }

      // Render children.
      if (ent.children.length > 0) {
        ent.children.forEach((child) => {
          this.recursiveRender(child);
        });
      }
    }

    render(gameworld) {
        this.ctx.viewport(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.clear(DARK);
        this.program.activate();
        
        var cameraID = gameworld.scene.mainCameraID;
        this.ctx.uniformMatrix4fv(
            this.program.uniformLocation("u_projectionMatrix"),
            false,
            gameworld.scene.cameras[cameraID].projectionMatrix
        );

        this.ctx.uniformMatrix4fv(
            this.program.uniformLocation("u_viewMatrix"),
            false,
            gameworld.scene.cameras[cameraID].sceneNode.worldMatrix
        );

        var camPos = gameworld.scene.cameras[cameraID].transformComponent.getWorldTranslation();
        this.ctx.uniform3f(
            this.program.uniformLocation("u_viewWorldPos"),
            camPos[Math.X],
            camPos[Math.Y],
            camPos[Math.Z]
        );
        
        var patrolPos = gameworld.player.transformComponent.absOrigin;
        this.ctx.uniform3f(
            this.program.uniformLocation("u_patrolPos"),
            patrolPos[Math.X],
            patrolPos[Math.Y],
            patrolPos[Math.Z]
        );
    
        this.ctx.uniform1i(
            this.program.uniformLocation("u_pointLights"),
            plight
        );
        this.ctx.uniform1i(
            this.program.uniformLocation("u_directionalLight"),
            dlight
        );
        this.ctx.uniform1i(
            this.program.uniformLocation("u_spotLight"),
            slight
        );
        this.ctx.uniform1i(
            this.program.uniformLocation("u_fog"),
            fog
        );
        this.ctx.uniform1i(
            this.program.uniformLocation("u_ignoreLighting"),
            1
        );

        this.recursiveRender(gameworld);
        // Recursively render each mesh component.
        //gameworld.children.forEach((child) => {
          //this.recursiveRender(child);
        //});
    }
}
