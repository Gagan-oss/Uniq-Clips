import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { computeScrollProgress } from '../utils/validation';

const GOLD_HEX = '#c9a45c';
const CHAMPAGNE_HEX = '#f3e6c8';
const SCROLL_DEPTH = 46;

const _lookTarget = new THREE.Vector3();

function detectSoftwareGl(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createRadialGlowTexture(innerColor: string, size = 64): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, innerColor);
    grad.addColorStop(0.35, 'rgba(201,164,92,0.45)');
    grad.addColorStop(1, 'rgba(201,164,92,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createEmblemUGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-1.2, 1.55);
  shape.lineTo(-1, 0);
  shape.absarc(0, 0, 1, Math.PI, Math.PI * 2, false);
  shape.lineTo(1.2, 1.55);
  shape.lineTo(0.92, 1.64);
  shape.lineTo(0.6, 1.1);
  shape.lineTo(0.6, 0);
  shape.absarc(0, 0, 0.6, 0, Math.PI, true);
  shape.lineTo(-0.6, 1.1);
  shape.lineTo(-0.92, 1.64);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.34,
    bevelEnabled: true,
    bevelThickness: 0.16,
    bevelSize: 0.1,
    bevelSegments: 10,
    curveSegments: 56,
  });
  geo.translate(0, -0.3, -0.34 / 2);
  geo.computeVertexNormals();
  return geo;
}

interface ClipCardConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
  baseY: number;
}

export function GoldSceneCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && !isMobile,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      setContextLost(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75),
    );
    renderer.setSize(window.innerWidth, window.innerHeight);

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050505');
    scene.fog = new THREE.Fog('#050505', 7, 24);

    const camera = new THREE.PerspectiveCamera(
      38,
      window.innerWidth / window.innerHeight,
      0.1,
      60,
    );
    camera.position.set(0, 0, 8);

    // Studio PBR environment reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Warm/cool studio lighting rig
    const hemiLight = new THREE.HemisphereLight('#c5d4ff', '#1b1409', 0.45);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(CHAMPAGNE_HEX, 1.85);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const goldFill = new THREE.PointLight(GOLD_HEX, 14, 14);
    goldFill.position.set(-4, -2, 2);
    scene.add(goldFill);

    // Shared PBR materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: GOLD_HEX,
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.25,
    });
    const satinMat = new THREE.MeshStandardMaterial({
      color: '#d9bd80',
      metalness: 1,
      roughness: 0.38,
      envMapIntensity: 1,
    });
    const wireMat = new THREE.MeshBasicMaterial({
      color: GOLD_HEX,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const screenMat = new THREE.MeshStandardMaterial({
      color: '#0a0a0a',
      metalness: 0.6,
      roughness: 0.15,
      envMapIntensity: 0.6,
    });
    const glowMat = new THREE.MeshBasicMaterial({
      color: CHAMPAGNE_HEX,
    });
    const pearlMat = new THREE.MeshPhysicalMaterial({
      color: '#f7f2e8',
      roughness: 0.16,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      sheen: 1,
      sheenColor: new THREE.Color(CHAMPAGNE_HEX),
      sheenRoughness: 0.4,
    });

    const disposables: Array<{ dispose: () => void }> = [
      goldMat,
      satinMat,
      wireMat,
      screenMat,
      glowMat,
      pearlMat,
      envTarget,
    ];

    // Hero Gold Emblem Group (Composite 5-part Group)
    const emblemScale = isMobile ? 0.6 : 1.05;
    const emblemRoot = new THREE.Group();
    emblemRoot.position.set(isMobile ? 0 : 2.35, isMobile ? 1.9 : 0.1, isMobile ? -1.5 : 0);
    scene.add(emblemRoot);

    const haloTex = createRadialGlowTexture('rgba(243,230,200,0.9)', 256);
    const haloMat = new THREE.SpriteMaterial({
      map: haloTex,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const haloSprite = new THREE.Sprite(haloMat);
    haloSprite.scale.set(7, 7, 1);
    haloSprite.position.set(0, 0.1, -1.4);
    emblemRoot.add(haloSprite);
    disposables.push(haloTex, haloMat);

    const emblemSpinner = new THREE.Group();
    emblemSpinner.scale.setScalar(emblemScale);
    emblemRoot.add(emblemSpinner);

    const uGeo = createEmblemUGeometry();
    const uMesh = new THREE.Mesh(uGeo, goldMat);
    emblemSpinner.add(uMesh);

    const pearlGeo = new THREE.SphereGeometry(0.3, 48, 48);
    const pearlMesh = new THREE.Mesh(pearlGeo, pearlMat);
    pearlMesh.position.set(0, -0.6, 0.02);
    emblemSpinner.add(pearlMesh);

    const ring1Geo = new THREE.TorusGeometry(2.05, 0.012, 12, 160);
    const ring1Mesh = new THREE.Mesh(ring1Geo, satinMat);
    ring1Mesh.scale.setScalar(emblemScale);
    emblemRoot.add(ring1Mesh);

    const ring2Geo = new THREE.TorusGeometry(2.45, 0.006, 8, 160);
    const ring2Mesh = new THREE.Mesh(ring2Geo, satinMat);
    ring2Mesh.scale.setScalar(emblemScale);
    emblemRoot.add(ring2Mesh);

    disposables.push(uGeo, pearlGeo, ring1Geo, ring2Geo);

    // Floating vertical short-form clip cards (Composite 5-part Group per card)
    const cardFrameGeo = new RoundedBoxGeometry(0.92, 1.62, 0.06, 4, 0.06);
    const cardScreenGeo = new THREE.PlaneGeometry(0.8, 1.48);
    const cardPlayGeo = new THREE.CircleGeometry(0.11, 3);
    const cardBarFillGeo = new THREE.PlaneGeometry(0.42, 0.014);
    const cardBarTrackGeo = new THREE.PlaneGeometry(0.62, 0.014);
    disposables.push(cardFrameGeo, cardScreenGeo, cardPlayGeo, cardBarFillGeo, cardBarTrackGeo);

    const offsetX = isMobile ? 2.1 : 4.2;
    const cardConfigs: ClipCardConfig[] = [
      {
        position: isMobile ? [-1.7, 2.6, -3] : [5, 1.6, -2],
        rotation: [0.1, -0.5, 0.12],
        scale: 0.9,
        speed: 1.2,
        baseY: isMobile ? 2.6 : 1.6,
      },
      {
        position: isMobile ? [1.8, 0.4, -3.5] : [0.4, -2.1, -2.6],
        rotation: [-0.15, 0.4, -0.1],
        scale: 0.75,
        speed: 1.0,
        baseY: isMobile ? 0.4 : -2.1,
      },
      ...(isMobile
        ? []
        : [
            {
              position: [-4.6, 2.2, -5] as [number, number, number],
              rotation: [0.05, 0.6, -0.08] as [number, number, number],
              scale: 0.7,
              speed: 0.8,
              baseY: 2.2,
            },
          ]),
      {
        position: [offsetX, -0.6, -9],
        rotation: [0, -0.7, 0.1],
        scale: 1,
        speed: 1.1,
        baseY: -0.6,
      },
      {
        position: [-offsetX, 1.1, -15],
        rotation: [0.1, 0.8, -0.1],
        scale: 1.1,
        speed: 0.9,
        baseY: 1.1,
      },
      {
        position: [offsetX + 0.4, 1.4, -24],
        rotation: [-0.1, -0.6, 0.08],
        scale: 1,
        speed: 1.2,
        baseY: 1.4,
      },
      {
        position: [-offsetX - 0.3, -1.6, -31],
        rotation: [0.05, 0.7, 0.15],
        scale: 0.9,
        speed: 1.0,
        baseY: -1.6,
      },
      {
        position: [offsetX, -1.2, -40],
        rotation: [0.08, -0.5, -0.1],
        scale: 1.05,
        speed: 0.9,
        baseY: -1.2,
      },
    ];

    const clipCards: Array<{ group: THREE.Group; cfg: ClipCardConfig; phase: number }> = [];
    cardConfigs.forEach((cfg, idx) => {
      const card = new THREE.Group();
      card.position.set(...cfg.position);
      card.rotation.set(...cfg.rotation);
      card.scale.setScalar(cfg.scale);

      const frame = new THREE.Mesh(cardFrameGeo, goldMat);
      const screen = new THREE.Mesh(cardScreenGeo, screenMat);
      screen.position.set(0, 0, 0.032);

      const play = new THREE.Mesh(cardPlayGeo, glowMat);
      play.position.set(0.02, 0.06, 0.036);
      play.rotation.set(0, 0, -Math.PI / 2);

      const barFill = new THREE.Mesh(cardBarFillGeo, glowMat);
      barFill.position.set(-0.12, -0.6, 0.036);

      const barTrack = new THREE.Mesh(cardBarTrackGeo, screenMat);
      barTrack.position.set(0.09, -0.6, 0.035);

      card.add(frame, screen, play, barFill, barTrack);
      scene.add(card);
      clipCards.push({ group: card, cfg, phase: idx * 1.35 });
    });

    // Background rotating geometric accents
    const accentR = isMobile ? 2.4 : 4.4;
    const icoWireGeo = new THREE.IcosahedronGeometry(1.1, 1);
    const icoCoreGeo = new THREE.IcosahedronGeometry(1, 0);
    const torusOuterGeo = new THREE.TorusGeometry(1.05, 0.08, 24, 120);
    const torusInnerGeo = new THREE.TorusGeometry(0.78, 0.05, 20, 100);
    const octGeo = new THREE.OctahedronGeometry(0.9, 0);
    const knotGeo = new THREE.TorusKnotGeometry(0.75, 0.16, 180, 24, 2, 3);
    const dodecaGeo = new THREE.DodecahedronGeometry(1.2, 0);
    const dodecaCoreGeo = new THREE.SphereGeometry(1, 32, 32);
    disposables.push(
      icoWireGeo,
      icoCoreGeo,
      torusOuterGeo,
      torusInnerGeo,
      octGeo,
      knotGeo,
      dodecaGeo,
      dodecaCoreGeo,
    );

    const spinners: Array<{ group: THREE.Group; speed: number }> = [];

    const g1 = new THREE.Group();
    g1.position.set(-accentR, -1.2, -11);
    g1.add(new THREE.Mesh(icoWireGeo, wireMat));
    const g1Core = new THREE.Mesh(icoCoreGeo, goldMat);
    g1Core.scale.setScalar(0.42);
    g1.add(g1Core);
    scene.add(g1);
    spinners.push({ group: g1, speed: 0.25 });

    const g2 = new THREE.Group();
    g2.position.set(accentR + 0.4, 0.6, -19);
    g2.add(new THREE.Mesh(torusOuterGeo, goldMat));
    const g2Inner = new THREE.Mesh(torusInnerGeo, satinMat);
    g2Inner.rotation.set(Math.PI / 2, 0, 0);
    g2.add(g2Inner);
    scene.add(g2);
    spinners.push({ group: g2, speed: 0.18 });

    const g3 = new THREE.Group();
    g3.position.set(-accentR - 0.2, 0.9, -27);
    g3.add(new THREE.Mesh(octGeo, goldMat));
    const g3Wire = new THREE.Mesh(octGeo, wireMat);
    g3Wire.scale.setScalar(1.6);
    g3.add(g3Wire);
    scene.add(g3);
    spinners.push({ group: g3, speed: 0.3 });

    const g4 = new THREE.Group();
    g4.position.set(accentR, 0.2, -35);
    g4.add(new THREE.Mesh(knotGeo, goldMat));
    scene.add(g4);
    spinners.push({ group: g4, speed: 0.15 });

    const g5 = new THREE.Group();
    g5.position.set(-accentR + 0.4, -0.4, -44);
    g5.add(new THREE.Mesh(dodecaGeo, wireMat));
    const g5Core = new THREE.Mesh(dodecaCoreGeo, pearlMat);
    g5Core.scale.setScalar(0.38);
    g5.add(g5Core);
    scene.add(g5);
    spinners.push({ group: g5, speed: 0.12 });

    // Golden dust particles
    const particleCount = isMobile ? 450 : 1100;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 2] = 9 - Math.random() * 60;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dustTex = createRadialGlowTexture('rgba(255,244,214,1)', 64);
    const dustMat = new THREE.PointsMaterial({
      map: dustTex,
      size: 0.075,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: '#e8d3a2',
    });
    const particles = new THREE.Points(particleGeo, dustMat);
    scene.add(particles);
    disposables.push(particleGeo, dustTex, dustMat);

    // Scroll & pointer tracking
    const inputState = {
      progress: computeScrollProgress(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight,
      ),
      px: 0,
      py: 0,
    };

    const onScrollOrResize = () => {
      inputState.progress = computeScrollProgress(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight,
      );
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const onPointerMove = (e: PointerEvent) => {
      inputState.px = (e.clientX / window.innerWidth) * 2 - 1;
      inputState.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();
    let elapsed = 0;

    function updateScene(dt: number) {
      const t = prefersReducedMotion ? 0 : elapsed;
      const p = inputState.progress;

      // Damped camera scroll path
      const targetX = Math.sin(p * Math.PI * 3) * 1.1 + (prefersReducedMotion ? 0 : inputState.px * 0.35);
      const targetY = -p * 1.5 + (prefersReducedMotion ? 0 : inputState.py * 0.25);
      const targetZ = 8 - p * SCROLL_DEPTH;
      const dampLambda = prefersReducedMotion ? 100 : 3.2;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, dampLambda, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, dampLambda, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, dampLambda, dt);

      _lookTarget.set(camera.position.x * 0.35, camera.position.y * 0.6, camera.position.z - 9);
      camera.lookAt(_lookTarget);
      camera.rotation.z += Math.sin(p * Math.PI * 2) * 0.03;

      // Emblem & rings
      emblemSpinner.rotation.y = Math.sin(t * 0.35) * 0.45 + p * Math.PI * 2.2;
      emblemSpinner.rotation.x = Math.sin(t * 0.25) * 0.08 + p * 0.6;
      emblemSpinner.position.y = Math.sin(t * 0.6) * 0.08;

      ring1Mesh.rotation.z = t * 0.12;
      ring1Mesh.rotation.x = 1.25 + Math.sin(t * 0.3) * 0.08;
      ring2Mesh.rotation.z = -t * 0.08;
      ring2Mesh.rotation.y = 0.5 + p * 2;

      if (!prefersReducedMotion) {
        for (const item of clipCards) {
          item.group.position.y = item.cfg.baseY + Math.sin(t * item.cfg.speed + item.phase) * 0.15;
          item.group.rotation.z = item.cfg.rotation[2] + Math.sin(t * 0.4 * item.cfg.speed + item.phase) * 0.08;
        }
        for (const sp of spinners) {
          sp.group.rotation.x += dt * sp.speed * 0.6;
          sp.group.rotation.y += dt * sp.speed;
        }
        particles.rotation.z = t * 0.01;
        particles.position.y = Math.sin(t * 0.2) * 0.25;
      }
    }

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      elapsed += dt;

      updateScene(dt);
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);

      for (const item of disposables) {
        item.dispose();
      }
      renderer.dispose();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  if (contextLost) {
    return null;
  }

  return (
    <div
      ref={mountRef}
      data-testid="gold-scene-canvas"
      className="absolute inset-0"
    />
  );
}

export function GoldSceneBackdrop() {
  const vignetteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!vignetteRef.current) return;
      const opacity = Math.min(1, window.scrollY / (window.innerHeight * 0.8));
      vignetteRef.current.style.opacity = String(opacity);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-ink">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_40%,rgb(201_164_92/0.16),transparent_70%)]" />
      <GoldSceneCanvas />
      <div
        ref={vignetteRef}
        className="absolute inset-0 opacity-0 bg-[radial-gradient(ellipse_75%_70%_at_50%_50%,rgb(5_5_5/0.78),rgb(5_5_5/0.25)_75%,transparent)]"
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/80 to-transparent" />
    </div>
  );
}
