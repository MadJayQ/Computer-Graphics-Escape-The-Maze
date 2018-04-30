class Model {
    constructor(glContext, indices, vertices, normals = undefined, color) {
        this.ctx = glContext;
        this.indices = indices;
        this.vertices = vertices;
        this.normals = normals;
        this.color = color;
        this.vtxBuffer = glContext.createBuffer();
        this.clrBuffer = glContext.createBuffer();


        this.hasLighting = false;

        this.drawType = this.ctx.TRIANGLES;

        this.numVertices = this.vertices.length / 3;

        this.reload();
    }

    setTexture(src, texCoords) {
        this.texture = src;
        this.texCoords = texCoords;
        console.log(texCoords);
        this.reload();
    }

    reload() {
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vtxBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.vertices), this.ctx.STATIC_DRAW);
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.clrBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.color), this.ctx.STATIC_DRAW);

        if(this.indices) {
            this.idxBuffer = this.ctx.createBuffer();
            this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.idxBuffer);
            this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.ctx.STATIC_DRAW);
        }

        if(this.normals) {
            this.hasLighting = true;
            this.normalBuffer = this.ctx.createBuffer();
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
            this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.normals), this.ctx.STATIC_DRAW);
        }
        if(this.texCoords) {
            console.log("YO");
            this.hasTexture = true;
            this.texCoordBuffer = this.ctx.createBuffer();
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texCoordBuffer);
            this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.texCoords), this.ctx.STATIC_DRAW);
        }
    }

    render(program) {
        {
            const numComponents = 3;
            const type = this.ctx.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vtxBuffer);
            this.ctx.vertexAttribPointer(
                program.attributeLocation("a_position"),
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            this.ctx.enableVertexAttribArray(
                program.attributeLocation("a_position")
            );
        }
        {
            const numComponents = 4;
            const type = this.ctx.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.clrBuffer);

            this.ctx.vertexAttribPointer(
                program.attributeLocation("a_color"),
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            this.ctx.enableVertexAttribArray(
                program.attributeLocation("a_color")
            );
        }
        if(this.normals && this.hasLighting) {
            {
                //console.log(this.normals);
                const numComponents = 3;
                const type = this.ctx.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
                this.ctx.vertexAttribPointer(
                    program.attributeLocation("a_normal"),
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset
                );
                this.ctx.enableVertexAttribArray(
                    program.attributeLocation("a_normal")
                );
            }
        }
        if(this.texCoords && this.hasTexture) {
            const numComponents = 2;
            const type = this.ctx.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texCoordBuffer);
            this.ctx.vertexAttribPointer(
                program.attributeLocation("a_texCoord"),
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            this.ctx.enableVertexAttribArray(
                program.attributeLocation("a_texCoord")
            );
            this.texture.bind();
            this.ctx.uniform1i(
                program.uniformLocation("u_texture"),
                0
            );
            this.ctx.uniform1i(
                program.uniformLocation("u_hasTexture"),
                1
            );
        } else {
            this.ctx.uniform1i(
                program.uniformLocation("u_hasTexture"),
                0
            );
        }
    }
};