import React, { useEffect, useRef, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import {
  createProgram,
  createTexture,
  setupVertexAttribs,
  createFramebuffer,
  createTextureFromHTMLElement,
  resize,
} from './utils';
import { createTextCanvas } from './background';
import kernelData from './kernel';
import { water_vs, water_fs } from './shaders/water';
import { dither_vs, dither_fs } from './shaders/dither';
import { out_vs, out_fs } from './shaders/out';

const StyledCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
  user-select: none;
`;

const Canvas = () => {
  const canvasRef = useRef(null);
  const { jumboFonts } = useContext(ThemeContext);

  function draw(gl, shuffle, frameCount, mouse, program) {
    let a = shuffle % 3;
    let b = (shuffle + 1) % 3;
    let c = (shuffle + 2) % 3;

    /* RIPPLE */
    gl.useProgram(program.ripple.prog);
    gl.bindFramebuffer(gl.FRAMEBUFFER, program.fbo.ripple);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      program.textures[c],
      0
    );
    gl.viewport(0, 0, program.ripple.w, program.ripple.h);

    gl.uniform1i(program.u.prevTex, 0);
    gl.uniform1i(program.u.currentTex, 1);
    gl.activeTexture(gl.TEXTURE0 + 0);
    gl.bindTexture(gl.TEXTURE_2D, program.textures[a]);
    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, program.textures[b]);

    gl.uniform1f(program.u.frame, frameCount);
    gl.uniform2f(program.u.resolution, program.ripple.w, program.ripple.h);
    gl.uniform3f(program.u.mouse, mouse.x, mouse.y, mouse.z);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    /* DITHER */
    gl.useProgram(program.dither.prog);
    gl.bindFramebuffer(gl.FRAMEBUFFER, program.fbo.output);
    gl.viewport(0, 0, program.dither.w, program.dither.h);
    gl.uniform2f(
      program.u.resolutionDither,
      program.dither.w,
      program.dither.h
    );
    gl.uniform1i(program.u.heightMap, 0);
    gl.uniform1i(program.u.background, 1);
    gl.uniform1i(program.u.kernel, 2);
    gl.activeTexture(gl.TEXTURE0 + 0);
    gl.bindTexture(gl.TEXTURE_2D, program.textures[b]);
    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, program.background);
    gl.activeTexture(gl.TEXTURE0 + 2);
    gl.bindTexture(gl.TEXTURE_2D, program.kernel);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    /* OUTPUT */
    gl.useProgram(program.output.prog);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, program.output.w, program.output.h);
    gl.uniform1i(program.u.outputTex, 0);
    gl.activeTexture(gl.TEXTURE0 + 0);
    gl.bindTexture(gl.TEXTURE_2D, program.outputTex);
    //gl.bindTexture(gl.TEXTURE_2D, program.kernel);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    const rippleProg = createProgram(gl, water_vs, water_fs);
    const ditherProg = createProgram(gl, dither_vs, dither_fs);
    const outputProg = createProgram(gl, out_vs, out_fs);
    const BASE_SCALE = 4;
    let RES, SCALE, deviceRatio;
    let animationFrameId, shuffle, frameCount;

    const init = () => {
      shuffle = 0;
      frameCount = 0;
      deviceRatio = resize(canvas);
      SCALE = Math.floor(BASE_SCALE * deviceRatio);
      RES = {
        x: Math.floor(canvas.width / SCALE),
        y: Math.floor(canvas.height / SCALE),
      };

      const black = new Uint8Array(RES.x * RES.y * 4).fill(128);
      const tex_A = createTexture(gl, RES.x, RES.y, black);
      const tex_B = createTexture(gl, RES.x, RES.y, black);
      const tex_C = createTexture(gl, RES.x, RES.y);
      const tex_OUT = createTexture(gl, RES.x, RES.y);
      const rippleFBO = createFramebuffer(gl, tex_C);
      const outputFBO = createFramebuffer(gl, tex_OUT);
      const canvasBg = createTextCanvas(
        RES.x,
        RES.y,
        'MSc Creative Computing Graduate Showcase',
        jumboFonts
      );
      const textBackground = createTextureFromHTMLElement(gl, canvasBg);

      const kernelTex = createTexture(gl, 4, 4, kernelData);
      const program = {
        ripple: {
          prog: rippleProg,
          w: RES.x,
          h: RES.y,
        },
        dither: {
          prog: ditherProg,
          w: RES.x,
          h: RES.y,
        },
        output: {
          prog: outputProg,
          w: canvas.width,
          h: canvas.height,
        },
        textures: [tex_A, tex_B, tex_C],
        background: textBackground,
        kernel: kernelTex,
        outputTex: tex_OUT,
        fbo: {
          ripple: rippleFBO,
          output: outputFBO,
        },
        u: {
          // Ripple Uniforms
          prevTex: gl.getUniformLocation(rippleProg, 'u_prevTex'),
          currentTex: gl.getUniformLocation(rippleProg, 'u_currentTex'),
          resolution: gl.getUniformLocation(rippleProg, 'u_resolution'),
          mouse: gl.getUniformLocation(rippleProg, 'u_mouse'),
          frame: gl.getUniformLocation(rippleProg, 'u_frame'),
          // Dither Uniforms
          heightMap: gl.getUniformLocation(ditherProg, 'u_heightMap'),
          background: gl.getUniformLocation(ditherProg, 'u_background'),
          resolutionDither: gl.getUniformLocation(ditherProg, 'u_resolution'),
          kernel: gl.getUniformLocation(ditherProg, 'u_kernel'),
          // Output Uniforms
          outputTex: gl.getUniformLocation(outputProg, 'u_texture'),
        },
      };

      setupVertexAttribs(gl, program.ripple.prog);
      setupVertexAttribs(gl, program.dither.prog);
      setupVertexAttribs(gl, program.output.prog);

      return program;
    };

    let program = init();

    let mouse = {
      x: 0,
      y: 0,
      z: 0,
    };
    let canDraw = false;

    let timeout;
    function handleMouse(e) {
      clearTimeout(timeout);
      canDraw = true;
      const deviceScale = SCALE / deviceRatio;
      const rect = canvas.getBoundingClientRect();
      mouse = {
        x: (e.clientX - rect.left) / deviceScale,
        y: (rect.height - (e.clientY - rect.top) - 1) / deviceScale,
        z: 1,
      };
      timeout = setTimeout(function () {
        mouse.z = 0;
      }, 500);
    }

    function handleTouch(e) {
      const touch = e.touches[0];
      clearTimeout(timeout);
      canDraw = true;
      const deviceScale = SCALE / deviceRatio;
      const rect = canvas.getBoundingClientRect();
      mouse = {
        x: (touch.clientX - rect.left) / deviceScale,
        y: (rect.height - (touch.clientY - rect.top) - 1) / deviceScale,
        z: 1,
      };
      timeout = setTimeout(function () {
        mouse.z = 0;
      }, 500);
    }

    canvas.addEventListener('click', handleMouse, false);
    canvas.addEventListener('mousemove', handleMouse, false);
    canvas.addEventListener('touchstart', handleTouch, false);
    canvas.addEventListener('touchmove', handleTouch, false);
    window.addEventListener(
      'resize',
      () => {
        program = init();
      },
      false
    );

    const render = () => {
      if (canDraw) {
        draw(gl, shuffle, frameCount, mouse, program);
        shuffle += 2;
        frameCount++;
      }
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return <StyledCanvas ref={canvasRef}></StyledCanvas>;
};

export default Canvas;
