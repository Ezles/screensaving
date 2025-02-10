// Common vertex shader attributes and uniforms
const commonVertexHeader = `#version 300 es
in vec2 position;
uniform float time;
uniform vec2 resolution;
out vec4 vColor;
`;

// Pattern 1: Matrix Digital Rain
export const matrixPattern = {
    vertex: `${commonVertexHeader}
void main() {
    float speed = 0.5;
    float y = mod(position.y - time * speed, 2.0) - 1.0;
    gl_Position = vec4(position.x, y, 0.0, 1.0);
    gl_PointSize = 4.0;
    float intensity = 0.5 + 0.5 * sin(time + position.y * 10.0);
    vColor = vec4(0.0, 0.8 + 0.2 * intensity, 0.0, intensity);
}`,
    fragment: `#version 300 es
precision highp float;
in vec4 vColor;
out vec4 fragColor;
void main() {
    vec2 circCoord = 2.0 * gl_PointCoord - 1.0;
    float alpha = smoothstep(1.0, 0.8, length(circCoord));
    fragColor = vec4(vColor.rgb, vColor.a * alpha);
}`
};

// Pattern 2: Cosmic Vortex
export const vortexPattern = {
    vertex: `${commonVertexHeader}
void main() {
    float angle = time * 0.2 + length(position) * 5.0;
    mat2 rotation = mat2(
        cos(angle), -sin(angle),
        sin(angle), cos(angle)
    );
    vec2 pos = rotation * position;
    float scale = 0.5 + 0.5 * sin(time + length(position) * 3.0);
    gl_Position = vec4(pos * scale, 0.0, 1.0);
    gl_PointSize = 3.0;
    vColor = vec4(0.5 + 0.5 * sin(time + length(position)),
                  0.5 + 0.5 * cos(time * 0.7),
                  0.8,
                  1.0);
}`,
    fragment: `#version 300 es
precision highp float;
in vec4 vColor;
out vec4 fragColor;
void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    fragColor = vec4(vColor.rgb, alpha);
}`
};

// Pattern 3: Aurora Borealis
export const auroraPattern = {
    vertex: `${commonVertexHeader}
void main() {
    float wave = sin(position.x * 4.0 + time) * 0.2;
    float y = position.y + wave;
    gl_Position = vec4(position.x, y, 0.0, 1.0);
    gl_PointSize = 2.0 + sin(time + position.x * 10.0) * 1.0;
    float hue = time * 0.1 + position.x * 0.5;
    vec3 color = 0.5 + 0.5 * vec3(
        sin(hue),
        sin(hue + 2.094),
        sin(hue + 4.189)
    );
    vColor = vec4(color, 0.8);
}`,
    fragment: `#version 300 es
precision highp float;
in vec4 vColor;
out vec4 fragColor;
void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    fragColor = vec4(vColor.rgb, vColor.a * alpha);
}`
};

// Pattern 4: Geometric Waves
export const geometricPattern = {
    vertex: `${commonVertexHeader}
void main() {
    float gridSize = 20.0;
    vec2 grid = floor(position * gridSize) / gridSize;
    float wave = sin(grid.x * 6.28 + time) * cos(grid.y * 6.28 + time) * 0.3;
    vec2 pos = position + vec2(0.0, wave);
    gl_Position = vec4(pos, 0.0, 1.0);
    gl_PointSize = 4.0;
    vColor = vec4(0.5 + 0.5 * sin(time + grid.x),
                  0.5 + 0.5 * cos(time + grid.y),
                  0.7,
                  1.0);
}`,
    fragment: `#version 300 es
precision highp float;
in vec4 vColor;
out vec4 fragColor;
void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    float alpha = 1.0 - step(0.5, dist);
    fragColor = vec4(vColor.rgb, alpha);
}`
};

// Pattern 5: Particle Galaxy
export const galaxyPattern = {
    vertex: `${commonVertexHeader}
void main() {
    float angle = time * 0.1 + length(position) * 3.0;
    float spiral = length(position) + time * 0.1;
    mat2 rotation = mat2(
        cos(spiral), -sin(spiral),
        sin(spiral), cos(spiral)
    );
    vec2 pos = rotation * position;
    gl_Position = vec4(pos, 0.0, 1.0);
    gl_PointSize = 2.0 + sin(time + length(position) * 5.0) * 1.0;
    float brightness = 0.5 + 0.5 * sin(time + length(position) * 10.0);
    vColor = vec4(0.8 + 0.2 * brightness,
                  0.3 + 0.2 * brightness,
                  0.8 + 0.2 * brightness,
                  brightness);
}`,
    fragment: `#version 300 es
precision highp float;
in vec4 vColor;
out vec4 fragColor;
void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    fragColor = vec4(vColor.rgb, vColor.a * alpha);
}`
};

export const patterns = [
    { name: "Matrix Digital Rain", shaders: matrixPattern },
    { name: "Cosmic Vortex", shaders: vortexPattern },
    { name: "Aurora Borealis", shaders: auroraPattern },
    { name: "Geometric Waves", shaders: geometricPattern },
    { name: "Particle Galaxy", shaders: galaxyPattern }
]; 