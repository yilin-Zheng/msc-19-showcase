export const out_vs = `#version 100
  attribute vec4 a_position;
  attribute vec2 a_texcoord;
  varying vec2 v_texcoord;

  void main(){
    gl_Position = a_position;
    v_texcoord = a_texcoord;
  }
`;

export const out_fs = `#version 100
  precision highp float;
  precision highp sampler2D;

  varying vec2 v_texcoord;
  uniform sampler2D u_heightMap;
  uniform sampler2D u_background;
  uniform vec2 u_resolution;

  #define TEXTURE 0

  void main(){

    vec3 blue = vec3(0.243, 0.0039, 1.0);

  #if TEXTURE == 0

    vec2 offset = 1.0/u_resolution;
    float a = texture2D(u_heightMap, v_texcoord-offset.yx).x;
    float b = texture2D(u_heightMap, v_texcoord-offset.xy).x;
    float c = texture2D(u_heightMap, v_texcoord+offset.xy).x;
    float d = texture2D(u_heightMap, v_texcoord+offset.yx).x;
    
    vec3 grad = normalize(vec3(c - b, d - a, 1.0));
    vec2 pix = (gl_FragCoord.xy/u_resolution);
    vec3 tmp_col = texture2D(u_background, pix + grad.xy*0.35).rgb;

		float h = texture2D(u_heightMap, v_texcoord).r;
		float sh = 1.35 - h*2.0;
    vec3 ripple_col = 1.0 - vec3(exp(pow(sh-.75,2.)*-10.), exp(pow(sh-.50,2.)*-20.), exp(pow(sh-.25,2.)*-10.));

    vec3 combined_col = tmp_col + ripple_col;

    float bright = 0.2126*combined_col.r + 0.7152*combined_col.g + 0.0722*combined_col.b;
    bright *= 0.8;
    gl_FragColor = mix(vec4(blue, 1.0), vec4(1.0), step(0.6, bright));

  #elif TEXTURE == 1

		float h = texture2D(u_heightMap, v_texcoord).r;
		float sh = 1.35 - h*2.0;
    vec3 col = vec3(exp(pow(sh-.75,2.)*-10.), exp(pow(sh-.50,2.)*-20.), exp(pow(sh-.25,2.)*-10.));
    gl_FragColor = vec4(col, 1.0);

  #elif TEXTURE == 2
    
		float h = texture2D(u_heightMap, v_texcoord).r;
		float sh = 1.35 - h*2.0;
    vec3 col = vec3(exp(pow(sh-.75,2.)*-10.), exp(pow(sh-.50,2.)*-20.), exp(pow(sh-.25,2.)*-10.));
    //float bright = 0.2126*col.r + 0.7152*col.g + 0.0722*col.b;
    float bright = 0.3333 * col.r + col.g + col.b;
    vec3 thresh = bright > 0.7 ? blue : vec3(1.0);
    gl_FragColor = vec4(thresh, 1.0);

  #else

		float h = texture2D(u_heightMap, v_texcoord).r;
		float sh = 1.35 - h*2.0;
    vec3 col = vec3(exp(pow(sh-.75,2.)*-10.), exp(pow(sh-.50,2.)*-20.), exp(pow(sh-.25,2.)*-10.));
    float bright = 0.3333 * (col.r + col.g + col.b);
    float b = mix(0.0, 1.0, step(threshold, bright));
    gl_FragColor = vec4(vec3(b), 1.0);
    
  #endif
  }
`;
