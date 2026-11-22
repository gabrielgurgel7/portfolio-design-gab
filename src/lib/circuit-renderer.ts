import {
  CanvasTexture,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

const tileWidth = 420;
const tileHeight = 340;
const diameter = 490;

const traces = [
  [
    [0, 29],
    [54, 29],
    [87, 62],
    [151, 62],
    [199, 110],
  ],
  [
    [0, 47],
    [46, 47],
    [91, 92],
    [133, 92],
  ],
  [
    [39, 112],
    [82, 112],
    [116, 146],
    [181, 146],
    [218, 109],
  ],
  [
    [0, 166],
    [61, 166],
    [89, 138],
    [116, 138],
  ],
  [
    [0, 206],
    [51, 206],
    [74, 183],
    [145, 183],
    [190, 228],
  ],
  [
    [0, 238],
    [54, 238],
    [97, 195],
    [136, 195],
  ],
  [
    [36, 285],
    [88, 285],
    [128, 245],
    [156, 245],
  ],
  [
    [0, 319],
    [122, 319],
    [172, 269],
    [238, 269],
    [262, 245],
  ],
  [
    [109, 12],
    [151, 12],
    [209, 70],
    [287, 70],
    [328, 29],
    [420, 29],
  ],
  [
    [160, 30],
    [209, 79],
    [277, 79],
    [309, 47],
    [420, 47],
  ],
  [
    [246, 0],
    [246, 28],
    [275, 57],
  ],
  [
    [286, 111],
    [321, 111],
    [349, 139],
    [394, 139],
    [420, 166],
  ],
  [
    [245, 134],
    [280, 134],
    [309, 163],
    [351, 163],
  ],
  [
    [205, 181],
    [247, 181],
    [272, 206],
    [420, 206],
  ],
  [
    [218, 224],
    [269, 224],
    [283, 238],
    [420, 238],
  ],
  [
    [293, 277],
    [325, 277],
    [367, 319],
    [420, 319],
  ],
  [
    [205, 304],
    [252, 304],
    [284, 336],
  ],
] as const;

function makeCircuitTexture() {
  const tile = document.createElement("canvas");
  tile.width = tileWidth * 2;
  tile.height = tileHeight * 2;
  const context = tile.getContext("2d");
  if (!context) throw new Error("Canvas 2D unavailable");
  context.scale(2, 2);
  context.lineJoin = "round";

  traces.forEach((trace, index) => {
    context.strokeStyle = index % 3 === 0 ? "#ffffff" : "rgba(255, 255, 255, .59)";
    context.lineWidth = index % 3 === 0 ? 2 : 1.1;
    context.beginPath();
    trace.forEach(([x, y], point) => {
      if (point === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();

    for (const [x, y] of [trace[0], trace[trace.length - 1]!]) {
      if (x < 5 || x > tileWidth - 5 || y < 5 || y > tileHeight - 5) continue;
      context.beginPath();
      context.arc(x, y, index % 3 === 0 ? 4.8 : 3.1, 0, Math.PI * 2);
      context.stroke();
    }
  });

  const texture = new CanvasTexture(tile);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
}

export function createCircuitRenderer(canvas: HTMLCanvasElement) {
  const texture = makeCircuitTexture();
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, powerPreference: "low-power" });
  } catch (error) {
    texture.dispose();
    throw error;
  }

  renderer.setClearColor(0, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.4));
  renderer.setSize(diameter, diameter);
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 3);
  camera.position.z = 1;
  const geometry = new PlaneGeometry(2, 2);
  const uniforms = {
    circuit: { value: texture },
    origin: { value: new Vector2() },
    tileSize: { value: new Vector2(tileWidth, tileHeight) },
    diameter: { value: diameter },
    time: { value: 0 },
    visibility: { value: 0 },
  };
  const material = new ShaderMaterial({
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D circuit;
      uniform vec2 origin;
      uniform vec2 tileSize;
      uniform float diameter;
      uniform float time;
      uniform float visibility;
      varying vec2 vUv;

      void main() {
        vec2 screen = origin + vec2(vUv.x, 1.0 - vUv.y) * diameter;
        vec2 pattern = screen / tileSize;
        float trace = texture2D(circuit, vec2(pattern.x, -pattern.y)).a;
        float mask = 1.0 - smoothstep(0.08, 0.49, distance(vUv, vec2(0.5)));
        float sweep = 0.5 + 0.5 * sin(vUv.x * 6.0 + vUv.y * 2.8 - time * 0.55);
        float gradient = 0.35 + 0.29 * smoothstep(0.18, 0.94, sweep);
        gl_FragColor = vec4(1.0, 1.0, 1.0, trace * mask * visibility * gradient);
      }
    `,
  });
  scene.add(new Mesh(geometry, material));

  return {
    render(x: number, y: number, intensity: number, time: number) {
      const left = x - diameter / 2;
      const top = y - diameter / 2;
      canvas.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      uniforms.origin.value.set(left, top);
      uniforms.time.value = time / 1000;
      uniforms.visibility.value = intensity;
      renderer.render(scene, camera);
      if (!canvas.hasAttribute("data-active")) canvas.setAttribute("data-active", "true");
    },
    hide() {
      canvas.removeAttribute("data-active");
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    },
  };
}
