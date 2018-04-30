class _Assets_ {
    constructor() {
        this.models = new Map();
        this.textures = new Map();
    }

    addModel(gl, mesh, name) {
        this.models[name] = new Model(
            gl,
            mesh.indices(),
            mesh.vertices(),
            (mesh.normals) ? mesh.normals() : undefined,
            mesh.color()
        );
    }
    addTexture(gl, src, name) {
        var t = new Texture.Builder(gl).fromHTMLImg(src);
        this.textures[name] = t.build();
    }

    getTexture(name) {
        return this.textures[name];
    }

    getModel(name) {
        return this.models[name];
    }
};
var Assets = (function(){
    var instance;
    return {
        getInstance: function(){
            if (null == instance) {
                instance = new _Assets_();            
                instance.constructor = null; 
            }
            return instance; 
        }
   };
})();