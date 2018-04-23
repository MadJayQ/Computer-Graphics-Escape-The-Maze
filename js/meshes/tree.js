var TreeMesh = () => {
    var faceColors = [
        [0.0,  1.0,  1.0,  1.0],    // Front face: white
        [0.0,  1.0,  0.0,  1.0],    // Green
    ];
    var indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
        24, 25, 26,     27, 28, 29,
        30, 31, 32,     33, 34, 35
    ];

    var trunkWidth = 0.5;
    var trunkDepth = 0.5;
    var trunkHeight = 2.5;
    var leafHeight = 0;
    var leafDepth = 0;
    var leafWidth = 1.5;
    var vertices = [
        // Front face
        -trunkWidth, -trunkHeight,  trunkDepth,
         trunkWidth, -trunkHeight,  trunkDepth,
         trunkWidth,  trunkHeight,  trunkDepth,
        -trunkWidth,  trunkHeight,  trunkDepth,

        // Back face
        -trunkWidth, -trunkHeight, -trunkDepth,
        -trunkWidth,  trunkHeight, -trunkDepth,
         trunkWidth,  trunkHeight, -trunkDepth,
         trunkWidth, -trunkHeight, -trunkDepth,

        // Top face
        -trunkWidth,  trunkHeight, -trunkDepth,
        -trunkWidth,  trunkHeight,  trunkDepth,
         trunkWidth,  trunkHeight,  trunkDepth,
         trunkWidth,  trunkHeight, -trunkDepth,

        // Bottom face
        -trunkWidth, -trunkHeight, -trunkDepth,
         trunkWidth, -trunkHeight, -trunkDepth,
         trunkWidth, -trunkHeight,  trunkDepth,
        -trunkWidth, -trunkHeight,  trunkDepth,

        // Right face
         trunkWidth, -trunkHeight, -trunkDepth,
         trunkWidth,  trunkHeight, -trunkDepth,
         trunkWidth,  trunkHeight,  trunkDepth,
         trunkWidth, -trunkHeight,  trunkDepth,

        // Left face
        -trunkWidth, -trunkHeight, -trunkDepth,
        -trunkWidth, -trunkHeight,  trunkDepth,
        -trunkWidth,  trunkHeight,  trunkDepth,
        -trunkWidth,  trunkHeight, -trunkDepth,

        //Right Tree Side
        trunkWidth,  trunkHeight,  leafDepth,
        trunkWidth,  leafHeight, leafDepth,
        trunkWidth + leafWidth, leafHeight, leafDepth,

        //Right Tree Side
        -trunkWidth,  trunkHeight,  leafDepth,
        -trunkWidth,  leafHeight, leafDepth,
        -trunkWidth - leafWidth, leafHeight, leafDepth,

        leafDepth,  trunkHeight, -trunkWidth,
        leafDepth, leafHeight, -trunkWidth,
        leafDepth, leafHeight, -trunkWidth - leafWidth,

        leafDepth,  trunkHeight, trunkWidth,
        leafDepth, leafHeight, trunkWidth,
        leafDepth, leafHeight, trunkWidth + leafWidth
    ];
    return {
        indices: () => { return indices; },
        vertices: () => { return vertices; },
        color: (portalColor) => {
            var c = [];
            for(var j = 0; j < vertices.length / 3; ++j) {
                const color = (j > 23) ? GRASS.serialize() : TRUNK.serialize();
                c.push(color[0], color[1], color[2], color[3]);
            }
            return c;
        }
    };
};
