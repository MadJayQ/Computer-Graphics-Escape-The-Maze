var RockMesh = () => {
    const front = -1.5; // Z position of
    const back  = 1;
    const top = 0.25;
    const bottom = -0.75;
    const left = -1;
    const right = 1

    const primaryColor = [0.329, 0.224, 0.196, 1.0];
    const highlightColor = [0.573, 0.176, 0.071, 1.0];
    const shadeColor = [0.137, 0.133, 0.133, 1.0];
    const darkColor = [0.094, 0.09, 0.086, 1.0];

    const colors = [

    ];
    const indices = [
        0, 1, 2, 2, 3, 0, //Base
        4, 5, 6, 6, 7, 4, //Base
        0, 4, 8, //Front
        3, 7, 8,
        4, 7, 8,
        1, 5, 9,
        2, 6, 9,
        5, 6, 9,
        0, 4, 10,
        1, 5, 10,
        4, 5, 10,
        3, 7, 11,
        2, 6, 11,
        6, 7, 11
    ];
    const vertices = [
        -1.0, 0.0, 1.0, //0 LBL
        -1.0, 0.0, -1.0, //1 LTL
        1.0, 0.0, -1.0, //2 LTR
        1.0, 0.0, 1.0, //3 - LBR
        -0.5, 1.0, 0.5, //4 UBL
        -0.5, 1.0, -0.5, //5 UTL
        0.5, 1.0, -0.5, //6 UTR
        0.5, 1.0, 0.5, //7 - UBR
        0.0, 0.0, 0.5, //8 - LCF
        0.0, 0.0, -0.5,//9 - LCB
        -0.5, 0.0, 0.0, //10 - LCL
        0.5, 0.0, 0.0 //11 - LCR
    ];

    return {
        indices: () => { return indices; },
        vertices: () => { return vertices; },
        color: () => {
            var c = [];
            for(var j = 0; j < vertices.length; ++j) {
                const color = ROCK.serialize();
                c = c.concat(color, color, color, color);
            }
            return c;
        }
    };
};
