var CoinMesh = () => {
    var faceColors = [
        [1.0,  1.0,  0.0,  1.0],    // Front face: white
        [1.0,  0.0,  0.0,  1.0],    // Back face: red
        [0.0,  1.0,  0.0,  1.0],    // Top face: green
        [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
        [1.0,  0.0,  1.0,  1.0],    // Left face: purple
    ];
    var indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];
    var normals = [
        // Front
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        
        // Back
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        
        // Top
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        
        // Bottom
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        
        // Right
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        
        // Left
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ];
    var vertices = [
        // Front face
        -0.2, -0.2,  0.2,
         0.2, -0.2,  0.2,
         0.2,  0.2,  0.2,
        -0.2,  0.2,  0.2,

        // Back face
        -0.2, -0.2, -0.2,
        -0.2,  0.2, -0.2,
         0.2,  0.2, -0.2,
         0.2, -0.2, -0.2,

        // Top face
        -0.2,  0.2, -0.2,
        -0.2,  0.2,  0.2,
         0.2,  0.2,  0.2,
         0.2,  0.2, -0.2,

        // Bottom face
        -0.2, -0.2, -0.2,
         0.2, -0.2, -0.2,
         0.2, -0.2,  0.2,
        -0.2, -0.2,  0.2,

        // Right face
         0.2, -0.2, -0.2,
         0.2,  0.2, -0.2,
         0.2,  0.2,  0.2,
         0.2, -0.2,  0.2,

        // Left face
        -0.2, -0.2, -0.2,
        -0.2, -0.2,  0.2,
        -0.2,  0.2,  0.2,
        -0.2,  0.2, -0.2,
    ];
    return {
        indices: () => { return indices; },
        vertices: () => { return vertices; },
        normals: () => { return normals; },
        color: (portalColor) => {
            var c = [];
            for(var j = 0; j < vertices.length / 3; ++j) {
                const color = (portalColor !== undefined) ? portalColor : faceColors[0];
                c = c.concat(color, color, color, color);
            }
            return c;
        }
    };
};