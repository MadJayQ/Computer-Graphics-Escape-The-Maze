precision mediump float;
varying vec4 v_color;
varying vec3 fakenormal;

uniform bool u_ignoreLighting;

void main()
{
    if(!u_ignoreLighting) {
        vec3 lightPos = normalize(vec3(0.0, 5000.0, 5000.0)) * 2.5;
        float d_light = dot(normalize(fakenormal), lightPos);
        float ambient = .3;
        if(d_light < 0.0) {
            d_light = 0.0;
        }
        gl_FragColor = vec4(vec3(v_color) * (d_light + ambient), 1); //Normalized between 0-1
    } else {
        gl_FragColor = v_color;
    }
}