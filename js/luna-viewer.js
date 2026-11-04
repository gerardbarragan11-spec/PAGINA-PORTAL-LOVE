import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// One download per URL for the whole page; STL files can exceed 50 MB.
const geometryCache = new Map();

function loadGeometry(url, onProgress) {
  if (!geometryCache.has(url)) {
    const request = new Promise((resolve, reject) => {
      new STLLoader().load(url, resolve, onProgress, () => reject(new Error(`No se pudo cargar ${url}`)));
    });
    request.catch(() => geometryCache.delete(url));
    geometryCache.set(url, request);
  }
  return geometryCache.get(url);
}

function mount(container, { modelUrl, label }) {
  const status = document.createElement('div');
  status.className = 'luna-stl-status';
  status.setAttribute('role', 'status');
  const statusText = document.createElement('span');
  const bar = document.createElement('span');
  bar.className = 'luna-stl-bar';
  const barFill = document.createElement('span');
  bar.append(barFill);
  status.append(statusText, bar);
  container.replaceChildren(status);
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', `Modelo 3D de ${label}. Arrastra para girarlo.`);

  const setStatus = (text, progress) => {
    statusText.textContent = text;
    bar.hidden = progress === undefined;
    if (progress !== undefined) barFill.style.transform = `scaleX(${progress})`;
  };

  let disposed = false;
  let started = false;
  let renderer;
  let controls;
  let frame = 0;
  let visible = true;
  let needsRender = true;
  let material;
  let resizeObserver;
  let visibilityObserver;

  function start() {
    if (started || disposed) return;
    started = true;
    setStatus('Cargando modelo 3D…', 0);
    loadGeometry(modelUrl, event => {
      if (event.lengthComputable) setStatus(`Cargando modelo 3D… ${Math.round((event.loaded / event.total) * 100)}%`, event.loaded / event.total);
    }).then(build).catch(error => {
      console.error(error);
      if (!disposed) setStatus(location.protocol === 'file:'
        ? 'Chrome bloquea los modelos 3D al abrir el archivo directamente. Usa un servidor local (Live Server).'
        : 'No se pudo cargar el modelo 3D.');
    });
  }

  function build(geometry) {
    if (disposed) return;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setStatus('Tu navegador no puede mostrar modelos 3D.');
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.append(canvas);

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xfff1f4, 0x5a2d3d, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 5);
    const fill = new THREE.DirectionalLight(0xffc9d6, 0.9);
    fill.position.set(-4, 1, -3);
    scene.add(key, fill);

    // STL has no materials: a warm matte finish matches the Portal Love palette.
    material = new THREE.MeshStandardMaterial({ color: 0xf4e8e2, roughness: 0.78, metalness: 0 });
    const mesh = new THREE.Mesh(geometry, material);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const center = box.getCenter(new THREE.Vector3());
    mesh.position.copy(center).multiplyScalar(-1);
    const pivot = new THREE.Group();
    pivot.rotation.x = -Math.PI / 2; // STL files are Z-up
    pivot.add(mesh);
    scene.add(pivot);

    const radius = (geometry.boundingSphere ?? (geometry.computeBoundingSphere(), geometry.boundingSphere)).radius;
    const camera = new THREE.PerspectiveCamera(35, 1, radius / 100, radius * 100);
    let interacted = false;
    const fitDistance = () => {
      const vHalf = THREE.MathUtils.degToRad(camera.fov) / 2;
      const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect);
      return (radius / Math.sin(Math.min(vHalf, hHalf))) * 1.2;
    };
    const resize = () => {
      const { clientWidth: width, clientHeight: height } = container;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (!interacted) {
        const distance = fitDistance();
        camera.position.set(0, distance * 0.18, distance);
        controls.minDistance = radius * 1.15;
        controls.maxDistance = distance * 2.5;
      }
      needsRender = true;
    };

    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);
    canvas.style.touchAction = 'pan-y'; // keep vertical page scroll on touch screens
    controls.addEventListener('start', () => { interacted = true; });
    controls.addEventListener('change', () => { needsRender = true; });

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    status.remove();

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const moved = controls.update();
      if (moved || needsRender) {
        renderer.render(scene, camera);
        needsRender = false;
      }
    };
    tick();
  }

  // Start downloading only when the viewer is about to be seen.
  visibilityObserver = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (visible) {
      needsRender = true;
      start();
    }
  }, { rootMargin: '300px 0px' });
  visibilityObserver.observe(container);
  setStatus('Preparando modelo 3D…');

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      visibilityObserver?.disconnect();
      resizeObserver?.disconnect();
      controls?.dispose();
      material?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    }
  };
}

window.PortaloversLunaViewer = Object.freeze({ mount });
window.dispatchEvent(new Event('portalovers:luna-viewer-ready'));
