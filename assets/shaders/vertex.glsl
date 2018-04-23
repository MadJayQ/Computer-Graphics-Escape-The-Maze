/*

attribute vec4 a_position;
attribute vec3 a_color;
attribute vec3 a_normal;

uniform vec3 u_viewWorldPos;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_projectionMatrix;
uniform mat4 u_normalTransform;

varying vec3 v_lighting;


vec3 illuminate(vec4 pos, vec3 nrm, Light src, Material mat) {
    vec3 s = normalize(vec3(src.position - pos));
    vec3 v = normalize(-pos.xyz);
    vec3 r = reflect(-s, nrm);

    vec3 ambient = src.ambient * mat.ambient;
    float sdotn = max(dot(s, nrm) , 0.0);
    vec3 diffuse = src.diffuse * mat.diffuse * sdotn;
    vec3 spec = vec3(0.0);

    if(sdotn > 0.0) {
        spec = src.specular * mat.specular * pow(max(dot(r, v), 0.0), mat.shine);
    }

    return ambient + diffuse + spec;
}




void main()
{


    vec4 p = u_modelMatrix * a_position;
    v_lighting = a_color;
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;
}
*/
precision mediump float;
attribute vec4 a_position;
attribute vec3 a_color;
attribute vec3 a_normal;

uniform vec3 u_viewWorldPos;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_projectionMatrix;
uniform mat4 u_normalTransform;
varying vec3 v_lighting;
varying vec3 v_normal;
varying vec4 v_pos;



void main()
{
    v_normal = a_normal;
    v_lighting = a_color;
    v_pos = a_position;
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;
}