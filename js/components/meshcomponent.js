class MeshComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_MESH, owner);
    }

    setModel(model) {
        this.model = model;
    }
    render(program, gl) {
        if(!this.model) return;
        this.model.render(program);
        gl.uniformMatrix4fv(
            program.uniformLocation("u_modelMatrix"),
            false,
            this.owner.components[ComponentID.COMPONENT_TRANSFORM].worldTransform
        );
        gl.uniformMatrix4fv(
            program.uniformLocation("u_normalTransform"),
            false,
            this.owner.components[ComponentID.COMPONENT_TRANSFORM].getNormalTransform()
        );
        gl.uniform1i(
            program.uniformLocation("u_ignoreLighting"),
            0
        );
        if(this.model.idxBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.idxBuffer);
            {
                const vertexCount = this.model.indices.length;
                const type = gl.UNSIGNED_SHORT;
                const offset = 0;
                gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
            }
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.model.vtxBuffer);
            {
                const vertexCount = this.model.numVertices;
                gl.drawArrays(
                    this.model.drawType,
                    0,
                    vertexCount
                );
            }
        }
    }

    static get CID() { return ComponentID.COMPONENT_MESH; };
};
