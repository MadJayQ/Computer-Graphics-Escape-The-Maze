class Texture {
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
            console.error("[TEXTURE]: ERROR CONSTRUCTING TEXTURE! INVALID BUILDER");
            return undefined;
        }
    }
    getTexture() {
        return this._texture;
    }
    bind() {
        var gl = this._ctx;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);

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
            fromHTMLImg(name) {
                this.texture = this.ctx.createTexture();
                this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.texture);
                var img = document.getElementById(name);
                this.ctx.texImage2D(
                    this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE,
                    img
                );
                this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.LINEAR);
                if (Math.isPowerOf2(img.width) && Math.isPowerOf2(img.height)) {
                    console.log("POW 2");
                   // Yes, it's a power of 2. Generate mips.
                   this.ctx.generateMipmap(this.ctx.TEXTURE_2D);
                   this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_S, this.ctx.REPEAT);
                   this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_T, this.ctx.REPEAT);
                } else {
                   // No, it's not a power of 2. Turn of mips and set
                   // wrapping to clamp to edge
                   this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_S, this.ctx.CLAMP_TO_EDGE);
                   this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_T, this.ctx.CLAMP_TO_EDGE);
                   this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.LINEAR);
                }
                this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
                return this;
            }
            fromPNG(src, onLoad) {
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
                    console.log("Texture loaded");
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                    gl.generateMipmap(gl.TEXTURE_2D);
                    onLoad();
                });
                return this;
            }
            build() {
                return new Texture(this);
            }
        }
        return Builder;
    }
};