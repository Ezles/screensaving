"use client";

import { patterns } from "./patterns";

const NUM_PARTICLES = 15000;

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("Shader compile error: " + info);
  }

  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program");

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error("Program link error: " + info);
  }

  return program;
}

export function initWebGL(
  gl: WebGL2RenderingContext,
  initialPatternIndex: number = 0
) {
  let currentPatternIndex = initialPatternIndex;
  let currentProgram: WebGLProgram | null = null;
  let vao: WebGLVertexArrayObject | null = null;
  let timeUniformLocation: WebGLUniformLocation | null = null;
  let resolutionUniformLocation: WebGLUniformLocation | null = null;

  function initPattern(patternIndex: number) {
    const pattern = patterns[patternIndex].shaders;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, pattern.vertex);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      pattern.fragment
    );

    if (currentProgram) {
      gl.deleteProgram(currentProgram);
    }
    currentProgram = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(currentProgram);

    const positionAttributeLocation = gl.getAttribLocation(
      currentProgram,
      "position"
    );
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    resolutionUniformLocation = gl.getUniformLocation(
      currentProgram,
      "resolution"
    );

    if (vao) {
      gl.deleteVertexArray(vao);
    }
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positions = new Float32Array(NUM_PARTICLES * 2);
    for (let i = 0; i < NUM_PARTICLES * 2; i += 2) {
      positions[i] = Math.random() * 2 - 1;
      positions[i + 1] = Math.random() * 2 - 1;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  }

  initPattern(currentPatternIndex);

  const startTime = performance.now();

  function render() {
    if (!currentProgram || !vao) return;

    if (gl.canvas instanceof HTMLCanvasElement) {
      const displayWidth = gl.canvas.clientWidth;
      const displayHeight = gl.canvas.clientHeight;
      if (
        gl.canvas.width !== displayWidth ||
        gl.canvas.height !== displayHeight
      ) {
        gl.canvas.width = displayWidth;
        gl.canvas.height = displayHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      }
    }

    const currentTime = (performance.now() - startTime) * 0.001;

    gl.clearColor(0.0, 0.0, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(currentProgram);
    gl.bindVertexArray(vao);

    if (timeUniformLocation) {
      gl.uniform1f(timeUniformLocation, currentTime);
    }

    if (resolutionUniformLocation) {
      gl.uniform2f(
        resolutionUniformLocation,
        gl.canvas.width,
        gl.canvas.height
      );
    }

    gl.drawArrays(gl.POINTS, 0, NUM_PARTICLES);

    requestAnimationFrame(render);
  }

  render();

  return (newPatternIndex: number) => {
    if (
      newPatternIndex >= 0 &&
      newPatternIndex < patterns.length &&
      newPatternIndex !== currentPatternIndex
    ) {
      currentPatternIndex = newPatternIndex;
      initPattern(currentPatternIndex);
    }
  };
}
