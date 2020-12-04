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
  uniform sampler2D u_texture;

  void main(){
		gl_FragColor = texture2D(u_texture, v_texcoord);
  }
`;
