function createProgram(gl, vs, fs) {
  const v_shader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(v_shader, vs);
  gl.compileShader(v_shader);
  const f_shader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(f_shader, fs);
  gl.compileShader(f_shader);

  const program = gl.createProgram();
  gl.attachShader(program, v_shader);
  gl.attachShader(program, f_shader);
  gl.linkProgram(program);

  return program;
}

function createTexture(gl, w, h, data = null) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    w,
    h,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    data
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  return t;
}

function createTextureFromHTMLElement(gl, element) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, element);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

function createTextCanvas(w, h, text, theme) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.canvas.width = w;
  ctx.canvas.height = h;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, w, h);

  ctx.font = `${Math.floor(h * 0.1)}px sans-serif`;
  ctx.fontWeight = 1000;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.save();
  ctx.scale(1, -1);
  ctx.fillStyle = 'white';
  ctx.fillText(text, w / 2, -h / 2);
  return ctx.canvas;
}

function createVAO(gl, program, attrs) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  for (const name in attrs) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(attrs[name]),
      gl.STATIC_DRAW
    );
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  }

  return vao;
}

function setupVertexAttribs(gl, program) {
  const pos_attr = gl.getAttribLocation(program, 'a_position');
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1]),
    gl.STATIC_DRAW
  );

  gl.enableVertexAttribArray(pos_attr);
  gl.vertexAttribPointer(pos_attr, 2, gl.FLOAT, false, 0, 0);

  const texcoord_attr = gl.getAttribLocation(program, 'a_texcoord');
  const texcoord_buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoord_buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(texcoord_attr);
  gl.vertexAttribPointer(texcoord_attr, 2, gl.FLOAT, false, 0, 0);
}

function createFramebuffer(gl, tex) {
  const f = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, f);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    tex,
    0
  );
  return f;
}

function resize(canvas) {
  var cssToRealPixels = window.devicePixelRatio || 1;
  var displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
  var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return cssToRealPixels;
}

export {
  createProgram,
  createTexture,
  createTextCanvas,
  createTextureFromHTMLElement,
  createVAO,
  setupVertexAttribs,
  createFramebuffer,
  resize,
};
