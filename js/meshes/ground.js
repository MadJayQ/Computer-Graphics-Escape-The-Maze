var GroundMesh = (size) => {
    var colors = [];
    var vertices = [
        -size, 0, size,
        -size, 0, -size,
        size, 0,  -size,

        size, 0, -size,
        size, 0, size,
        -size, 0, size
    ];

    var normals = [
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
        0.0, 1.0, 0.0
    ]

    for(var i = 0; i < vertices.length; i++) {
        var c = GRASS.serialize();
        colors = colors.concat(c,c,c,c);
    }
    return {
        indices: () => { return undefined; },
        vertices: () => { return vertices; },
        normals: () => { return normals},
        color: () => { return colors; }
    };
};
