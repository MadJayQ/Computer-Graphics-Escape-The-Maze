class Program {
    constructor(builder) {
        if(arguments.length === 1) {
            let ctx = builder.ctx;
            let texture = builder.texture;
            /*
                Object defineProperties
                define the properties of this object type
                Set writable flag to false to prevent modification post creation
            */
            Object.defineProperties(this, {
                '_ctx':{
                    value:ctx,
                    writable:false
                },
                '_texture':{
                    value:texture,
                    writable:false
                }
            });
        } else {
            console.error("[GL PROGRAM]: ERROR CONSTRUCTING GL PROGRAM! INVALID BUILDER");
            return undefined;
        }
    }
    static get Builder() {
        /*
            Javascript Builder Design Pattern
            Useful for constructing const instances of a certain object
            In this game we can build glPrograms with specific shaders
        */
        class Builder {
            constructor(glContext) {
                this.ctx = glContext;
            }
            fromPNG(src) {
                this.texture = this.ctx.createTexture();
                this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.texture);
                this.ctx.texImage2D(
                    this.ctx.TEXTURE_2D,
                    0,
                    this.ctx.RGBA,
                    1.0, 1.0, 0.0,
                    this.ctx.RGBA,
                    this.ctx.UNSIGNED_BYTE,
                    new Uint8Array([0, 0, 255, 255])
                );
                var image = new Image();
                image.src = src;
                var gl = this.ctx;
                var texture = this.texture;
                image.addEventListener('load', () => {
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                    gl.generateMipmap(gl.TEXTURE_2D);
                });
            }
            build() {
                return new Program(this);
            }
        }
        return Builder;
    }
};