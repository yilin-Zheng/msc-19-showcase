export const dither_vs = `#version 100
  attribute vec4 a_position;
  attribute vec2 a_texcoord;
  varying vec2 v_texcoord;

  void main(){
    gl_Position = a_position;
    v_texcoord = a_texcoord;
  }
`;

export const dither_fs = `#version 100
  precision highp float;
  precision highp sampler2D;

  varying vec2 v_texcoord;
  uniform sampler2D u_heightMap;
  uniform sampler2D u_background;
  uniform vec2 u_resolution;
  uniform sampler2D u_kernel;

  const vec2 half_texel = vec2(1.0 / 8.0);

  float dither(float c) {
    float closestColor = step(0.5, c);
    float secondClosestColor = 1.0 - closestColor;
    vec2 offset = mod(gl_FragCoord.xy, 4.0) / 4.0;
    float d = texture2D(u_kernel, offset).r;
    float dd = abs(closestColor - c);
    return (dd < d) ? closestColor : secondClosestColor;
  }

  float brightness(vec3 c){
    return 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;
  }

  void main(){
    vec3 blue = vec3(0.243, 0.0039, 1.0);

    vec2 offset = 1.0/u_resolution;
    float a = texture2D(u_heightMap, v_texcoord-offset.yx).x;
    float b = texture2D(u_heightMap, v_texcoord-offset.xy).x;
    float c = texture2D(u_heightMap, v_texcoord+offset.xy).x;
    float d = texture2D(u_heightMap, v_texcoord+offset.yx).x;
    
    vec3 grad = normalize(vec3(c - b, d - a, 1.0));
    vec2 pix = (gl_FragCoord.xy/u_resolution) * vec2(1.0, -1.0) + vec2(0.0, 1.0);
    vec3 tmp_col = texture2D(u_background, pix + grad.xy*0.35).rgb;

    float h = texture2D(u_heightMap, v_texcoord).r;
    float sh = 1.35 - h*2.0;
    vec3 ripple_col = 1.0 - vec3(exp(pow(sh-.75,2.)*-10.), exp(pow(sh-.50,2.)*-20.), exp(pow(sh-.25,2.)*-10.));

    vec3 combined_col = tmp_col + ripple_col;

    float bright = brightness(combined_col);
    //bright *= 0.8;
    gl_FragColor = mix( vec4(blue, 1.0),vec4(1.0), dither(bright-0.4));

    //gl_FragColor = vec4(vec3((bright-0.4)), 1.0);

    //gl_FragColor = vec4(vec3(dither(brightness(vec3((v_texcoord), 1.0)))), 1.0);
    //gl_FragColor = texture2D(u_kernel, gl_FragCoord.xy/u_resolution);
  }
`;
