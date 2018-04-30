precision mediump float;
varying vec3 v_lighting;
varying vec3 v_normal;
varying vec4 v_pos;
varying vec2 v_texCoord;


uniform vec3 u_viewWorldPos;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_projectionMatrix;
uniform mat4 u_normalTransform;

uniform vec3 u_patrolPos;
uniform vec3 u_patrolRot;

uniform bool u_ignoreLighting;
uniform bool u_pointLights;
uniform bool u_spotLight;
uniform bool u_directionalLight;
uniform bool u_fog;

uniform sampler2D u_texture;
uniform bool u_hasTexture;

struct PLight {
    vec4 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float radius;
    float falloff;
    float intensity;
};

struct SLight {
    vec4 position;
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    float limit;
};

struct DLight {
    vec4 position;
    vec3 direction;
    vec3 diffuse;
};

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shine;
};

const vec3 fogColor = vec3(0.5, 0.5, 0.5);
const float fogDensity = 0.0095;


vec3 illuminate_spot(vec4 pos, vec3 nrm, SLight src, Material mat) {
    vec3 s = normalize(vec3(src.position - pos));
    vec3 v = normalize(-pos.xyz);

    float light = 0.0;
    float dotDirection = dot(s, -src.direction);
    if(dotDirection >= 0.999) {
        light = dot(nrm, s);
    }
    return src.diffuse * mat.ambient * light;
}

vec3 illuminate_direction(vec4 pos, vec3 nrm, DLight src, Material mat) {
    vec3 lightPos = normalize(vec3(src.position)) * 0.25;
    float d_light = dot(normalize(nrm), lightPos);
    if(d_light < 0.0) {
        d_light = 0.0;
    }
    return vec3(mat.ambient) * (d_light); //Normalized between 0-1
}

vec3 illuminate_point(vec4 pos, vec3 nrm, PLight src, Material mat) {
    vec3 s = normalize(vec3(src.position - pos));
    vec3 v = normalize(-pos.xyz);
    vec3 r = reflect(-s, nrm);


    float radius = src.radius;

    float dist = length(vec3(src.position - pos));
    float d = max(dist - radius, 0.0);
    
    float denom = d / radius + 1.0;
    float attenuation = (1.0 / pow(denom, src.falloff)) * src.intensity;


    vec3 ambient = src.ambient * mat.ambient;
    float sdotn = max(dot(s, nrm) , 0.0);
    vec3 diffuse = src.diffuse * mat.diffuse * sdotn * attenuation;
    vec3 spec = vec3(0.0);

    if(sdotn > 0.0) {
        spec = src.specular * mat.specular * pow(max(dot(r, v), 0.0), mat.shine);
    }

    return ambient + diffuse;
}


void main()
{   
    PLight src; //Green
    src.position = vec4(-74.0, 25.0, -175.0, 1.0);
    src.ambient = vec3(0.0, 0.0, 0.0);
    src.diffuse = vec3(0.55, 0.80, 0.31);
    src.specular = vec3(1.0, 1.0, 1.0);
    src.falloff = 2.0;
    src.intensity = 0.65;
    src.radius = 50.0;

    PLight src2; //Blue
    src2.position = vec4(75.0, 25.0, 91.0, 1.0);
    src2.ambient = vec3(0.1, 0.1, 0.1);
    src2.diffuse = vec3(0.35, 0.26, 0.75);
    src2.specular = vec3(1.0, 1.0, 1.0);
    src2.falloff = 2.0;
    src2.intensity = 0.65;
    src2.radius = 50.0;

    PLight src3;
    src3.position = vec4(-80.0, 25.0, 112.0, 1.0);
    src3.ambient = vec3(0.0, 0.0, 0.0);
    src3.diffuse = vec3(1.0, 1.0, 1.0);
    src3.specular = vec3(1.0, 1.0, 1.0);
    src3.falloff = 2.0;
    src3.intensity = 0.65;
    src3.radius = 50.0;

    PLight src4;
    src4.position = vec4(40.0, 25.0, -128.0, 1.0);
    src4.ambient = vec3(0.0, 0.0, 0.0);
    src4.diffuse = vec3(1.0, 0.5, 1.0);
    src4.specular = vec3(1.0, 1.0, 1.0);
    src4.falloff = 2.0;
    src4.intensity = 0.65;
    src4.radius = 50.0;


    PLight src5;
    src5.position = vec4(-6.0, 25.0, -7.0, 1.0);    
    src5.ambient = vec3(0.0, 0.0, 0.0);
    src5.diffuse = vec3(0.38, 0.18, 0.40);
    src5.specular = vec3(1.0, 1.0, 1.0);
    src5.falloff = 2.0;
    src5.intensity = 0.25;
    src5.radius = 50.0;

    SLight spot;
    spot.position = vec4(256.0 + 2.0, 125.0, 368.0 - 3.2, 1.0);
    spot.diffuse = vec3(0.1, 1.0, 0.1);
    spot.direction = vec3(0.0, -1.0, 0.0);
    spot.limit = 50.0;

    DLight dlight;
    dlight.position = vec4(0.0, 50.0, 50.0, 1.0);
    dlight.diffuse = vec3(1.0, 1.0, 1.0);

    Material mat;
    mat.ambient = v_lighting;
    mat.diffuse = vec3(1.0, 1.0, 1.0);
    mat.specular = vec3(0.8, 0.8, 0.8);
    mat.shine = 100.0;

    if(u_hasTexture) {
        mat.ambient = vec3(texture2D(u_texture, v_texCoord));
    }

    if(!u_ignoreLighting) {
        vec4 p = u_modelMatrix * v_pos;
        vec3 n = normalize(mat3(u_normalTransform) * v_normal);
        vec3 lightColor = vec3(0.0, 0.0, 0.0);
        float dist = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = 1.0 / exp(pow(dist * fogDensity, 2.0));
        fogFactor = clamp(fogFactor, 0.0, 1.0);

        if(u_pointLights) {
            lightColor += (
                illuminate_point(p, n, src, mat) + 
                illuminate_point(p, n, src2, mat) + 
                illuminate_point(p, n, src3, mat) + 
                illuminate_point(p, n, src4, mat) + 
                illuminate_point(p, n, src5, mat)
            );
        }
        if(u_spotLight) {
            lightColor += illuminate_spot(p, n, spot, mat);
        }
        if(u_directionalLight) {
            lightColor += illuminate_direction(p, n, dlight, mat);
        }
        vec3 finalColor = v_lighting;
        if(u_fog) {
            finalColor = mix(fogColor, lightColor, fogFactor);
        } else {
            finalColor = lightColor;
        }
        gl_FragColor = vec4(finalColor, 1.0);
    } else {
        gl_FragColor = vec4(v_lighting, 1.0);
    }

}