import * as THREE from 'three';

/* ============================================================
   The hero diorama: the physical poultry business on one side of
   a device, resolving into its financial picture on the other.
   Imperative three.js — React never re-renders inside the loop.
   ============================================================ */

export type Quality = 'low' | 'high';

export interface HeroSceneOptions {
  quality: Quality;
  reducedMotion: boolean;
}

const COLOURS = {
  ground: 0x0c1110,
  grid: 0x1e2a27,
  structure: 0x22302c,
  roof: 0x2e6b4f,
  shell: 0x151c1b,
  metal: 0x2a3634,
  egg: 0xf3e7d3,
  bag: 0xb9a06a,
  tray: 0x39423f,
  gold: 0xefa93a,
  goldSoft: 0xffd484,
  steel: 0x6f97be,
  paper: 0xf4f1e9,
};

function roundedRectShape(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const w = width / 2;
  const h = height / 2;
  const r = Math.min(radius, w, h);
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);
  return shape;
}

function roundedSlab(width: number, height: number, depth: number, radius: number) {
  const geometry = new THREE.ExtrudeGeometry(roundedRectShape(width, height, radius), {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 2,
    curveSegments: 8,
  });
  geometry.center();
  return geometry;
}

/** The product interface, drawn to a canvas so the device shows a real screen. */
function makeScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const round = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    ctx.fillStyle = '#f7f8f5';
    ctx.fillRect(0, 0, 512, 1024);

    ctx.fillStyle = '#123c2a';
    ctx.fillRect(0, 0, 512, 150);
    ctx.fillStyle = '#e6ded0';
    ctx.font = '600 26px system-ui, sans-serif';
    ctx.fillText('AMRUT', 34, 62);
    ctx.fillStyle = '#9db8ab';
    ctx.font = '500 18px system-ui, sans-serif';
    ctx.fillText('Poultry Management', 34, 92);
    ctx.fillStyle = '#f7c25c';
    ctx.font = '600 20px system-ui, sans-serif';
    ctx.fillText('Today', 34, 130);

    const cards = [
      ['Eggs collected', '18,420'],
      ['Eggs sold', '17,100'],
      ['Egg stock', '6,240'],
    ];
    cards.forEach(([label, value], i) => {
      const x = 28 + i * 158;
      ctx.fillStyle = '#ffffff';
      round(x, 186, 142, 108, 14);
      ctx.fill();
      ctx.strokeStyle = '#e3e7e3';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#66706a';
      ctx.font = '500 15px system-ui, sans-serif';
      ctx.fillText(label, x + 16, x < 200 ? 218 : 218);
      ctx.fillStyle = '#17201b';
      ctx.font = '700 30px system-ui, sans-serif';
      ctx.fillText(value, x + 16, 268);
    });

    // production trend
    ctx.fillStyle = '#ffffff';
    round(28, 320, 456, 220, 16);
    ctx.fill();
    ctx.strokeStyle = '#e3e7e3';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#66706a';
    ctx.font = '500 16px system-ui, sans-serif';
    ctx.fillText('Egg production — last 14 days', 52, 356);
    ctx.beginPath();
    const points = [0.52, 0.48, 0.55, 0.6, 0.57, 0.63, 0.66, 0.61, 0.68, 0.72, 0.7, 0.75, 0.78, 0.74];
    points.forEach((value, i) => {
      const x = 52 + i * 31;
      const y = 520 - value * 130;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#1b5e3b';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.lineTo(52 + 13 * 31, 520);
    ctx.lineTo(52, 520);
    ctx.closePath();
    ctx.fillStyle = 'rgba(27,94,59,0.10)';
    ctx.fill();

    // ledger rows
    const rows = [
      ['Godown · feed in', '₹1,24,500'],
      ['Trader · egg sale', '₹3,00,000'],
      ['Payment received', '₹1,50,000'],
      ['Shed expense', '₹42,300'],
    ];
    rows.forEach(([label, value], i) => {
      const y = 574 + i * 86;
      ctx.fillStyle = '#ffffff';
      round(28, y, 456, 70, 12);
      ctx.fill();
      ctx.strokeStyle = '#e3e7e3';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#17201b';
      ctx.font = '500 19px system-ui, sans-serif';
      ctx.fillText(label, 52, y + 43);
      ctx.fillStyle = i === 1 || i === 2 ? '#1b5e3b' : '#66706a';
      ctx.font = '700 20px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(value, 460, y + 43);
      ctx.textAlign = 'left';
    });

    // P&L bar
    ctx.fillStyle = '#123c2a';
    round(28, 928, 456, 66, 12);
    ctx.fill();
    ctx.fillStyle = '#f7c25c';
    ctx.font = '700 22px system-ui, sans-serif';
    ctx.fillText('Net P&L  +₹1,13,200', 52, 968);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** A sales document, used in the commerce station. */
function makePaperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f4f1e9';
    ctx.fillRect(0, 0, 256, 340);
    ctx.fillStyle = '#123c2a';
    ctx.fillRect(0, 0, 256, 46);
    ctx.fillStyle = '#cfdcd4';
    ctx.font = '600 15px system-ui, sans-serif';
    ctx.fillText('EGG SALE', 16, 29);
    const lines = [
      [0.72, 0.34],
      [0.5, 0.44],
      [0.64, 0.54],
      [0.42, 0.64],
      [0.58, 0.74],
    ];
    lines.forEach(([w, y]) => {
      ctx.fillStyle = '#dfe3dd';
      ctx.fillRect(16, y * 340, w * 180, 10);
    });
    ctx.fillStyle = '#c9972e';
    ctx.fillRect(16, 292, 160, 16);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function radialGlowTexture(colour: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, colour);
    gradient.addColorStop(0.45, 'rgba(239,169,58,0.16)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

interface Flow {
  curve: THREE.QuadraticBezierCurve3;
  packet: THREE.Mesh;
  offset: number;
  speed: number;
}

export class HeroScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly root = new THREE.Group();
  private readonly phone = new THREE.Group();
  private readonly flows: Flow[] = [];
  private readonly textures: THREE.Texture[] = [];
  private particles?: THREE.Points;
  private frame = 0;
  private running = false;
  private elapsed = 0;
  private last = 0;
  private pointer = new THREE.Vector2(0, 0);
  private eased = new THREE.Vector2(0, 0);
  private progress = 0;
  private readonly reduced: boolean;
  private readonly high: boolean;
  private resizeObserver?: ResizeObserver;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    options: HeroSceneOptions,
  ) {
    this.reduced = options.reducedMotion;
    this.high = options.quality === 'high';

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: this.high,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.high ? 1.85 : 1.3));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);
    this.camera.position.set(0, 3.2, 13.2);
    this.camera.lookAt(0, 0.4, 0);

    this.scene.fog = new THREE.FogExp2(0x060808, 0.042);
    this.scene.add(this.root);

    this.buildLights();
    this.buildGround();
    this.buildDevice();
    this.buildStations();
    if (this.high) this.buildParticles();

    this.resize();
    this.observeResize();
    this.render();
  }

  // ---- construction -------------------------------------------------------

  private buildLights() {
    this.scene.add(new THREE.HemisphereLight(0x2c3d38, 0x05070a, 0.7));

    const key = new THREE.DirectionalLight(0xfff0d4, 1.6);
    key.position.set(5, 9, 7);
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0x6f97be, 0.65);
    rim.position.set(-7, 2.5, -6);
    this.scene.add(rim);

    const amber = new THREE.PointLight(COLOURS.gold, 26, 20, 2);
    amber.position.set(0, 1.4, 3.2);
    this.scene.add(amber);
  }

  private buildGround() {
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(9.2, 72),
      new THREE.MeshStandardMaterial({ color: COLOURS.ground, roughness: 0.95, metalness: 0.12 }),
    );
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = -1.85;
    this.root.add(disc);

    const polar = new THREE.PolarGridHelper(9, 16, 6, 72, COLOURS.grid, COLOURS.grid);
    polar.position.y = -1.83;
    const polarMaterial = polar.material as THREE.Material;
    polarMaterial.transparent = true;
    polarMaterial.opacity = 0.5;
    this.root.add(polar);
  }

  private buildDevice() {
    const body = new THREE.Mesh(
      roundedSlab(2.1, 4.25, 0.18, 0.34),
      new THREE.MeshStandardMaterial({ color: COLOURS.shell, roughness: 0.34, metalness: 0.85 }),
    );
    this.phone.add(body);

    const screenTexture = makeScreenTexture();
    this.textures.push(screenTexture);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.86, 4.0),
      new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }),
    );
    screen.position.z = 0.101;
    this.phone.add(screen);

    this.phone.position.set(0, 0.55, 0);
    this.phone.rotation.set(-0.06, 0.22, 0);
    this.root.add(this.phone);

    const glowTexture = radialGlowTexture('rgba(239,169,58,0.55)');
    this.textures.push(glowTexture);
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 9),
      new THREE.MeshBasicMaterial({
        map: glowTexture,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.position.set(0, 0.4, -1.6);
    this.root.add(glow);
  }

  private standard(color: number, roughness = 0.55, metalness = 0.2) {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness });
  }

  /** A small physical object standing for one part of the business. */
  private buildStation(kind: string): THREE.Group {
    const group = new THREE.Group();

    if (kind === 'shed') {
      const walls = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.72, 0.95), this.standard(COLOURS.structure, 0.7));
      walls.position.y = 0.36;
      const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 1.6, 3, 1), this.standard(COLOURS.roof, 0.55, 0.25));
      roof.rotation.z = Math.PI / 2;
      roof.rotation.y = Math.PI / 2;
      roof.scale.set(1, 1, 0.62);
      roof.position.y = 0.95;
      group.add(walls, roof);
    }

    if (kind === 'eggs') {
      const tray = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.1, 0.62), this.standard(COLOURS.tray, 0.85));
      tray.position.y = 0.05;
      group.add(tray);
      const count = this.high ? 18 : 10;
      const eggs = new THREE.InstancedMesh(
        new THREE.SphereGeometry(0.12, 12, 10),
        this.standard(COLOURS.egg, 0.45),
        count,
      );
      const matrix = new THREE.Matrix4();
      const scale = new THREE.Vector3(1, 1.28, 1);
      const quaternion = new THREE.Quaternion();
      let index = 0;
      for (let row = 0; row < 2 && index < count; row += 1) {
        for (let column = 0; column < 9 && index < count; column += 1) {
          matrix.compose(
            new THREE.Vector3(-0.56 + column * 0.14, 0.2, -0.15 + row * 0.28),
            quaternion,
            scale,
          );
          eggs.setMatrixAt(index, matrix);
          index += 1;
        }
      }
      eggs.instanceMatrix.needsUpdate = true;
      group.add(eggs);
    }

    if (kind === 'feed') {
      const bagGeometry = roundedSlab(0.62, 0.92, 0.26, 0.1);
      [
        [-0.18, 0.46, 0, 0.05],
        [0.24, 0.46, 0.05, -0.08],
        [0.02, 1.36, 0.02, 0.02],
      ].forEach(([x, y, z, tilt]) => {
        const bag = new THREE.Mesh(bagGeometry, this.standard(COLOURS.bag, 0.9));
        bag.position.set(x, y, z);
        bag.rotation.set(tilt, tilt * 2, tilt);
        group.add(bag);
      });
    }

    if (kind === 'godown') {
      const crateGeometry = new THREE.BoxGeometry(1.05, 0.5, 0.8);
      const edgeGeometry = new THREE.EdgesGeometry(crateGeometry);
      [0.25, 0.79].forEach((y, i) => {
        const crate = new THREE.Mesh(crateGeometry, this.standard(i ? 0x1d2725 : COLOURS.metal, 0.6, 0.45));
        crate.position.y = y;
        crate.rotation.y = i ? 0.14 : -0.08;
        const edges = new THREE.LineSegments(
          edgeGeometry,
          new THREE.LineBasicMaterial({ color: COLOURS.steel, transparent: true, opacity: 0.4 }),
        );
        edges.position.copy(crate.position);
        edges.rotation.copy(crate.rotation);
        group.add(crate, edges);
      });
    }

    if (kind === 'paper') {
      const paperTexture = makePaperTexture();
      this.textures.push(paperTexture);
      const sheetGeometry = new THREE.PlaneGeometry(0.78, 1.04);
      [
        [-0.1, 0.6, 0, -0.14],
        [0.16, 0.68, 0.06, 0.12],
      ].forEach(([x, y, z, tilt]) => {
        const sheet = new THREE.Mesh(
          sheetGeometry,
          new THREE.MeshStandardMaterial({ map: paperTexture, roughness: 0.85, side: THREE.DoubleSide }),
        );
        sheet.position.set(x, y, z);
        sheet.rotation.set(-0.1, tilt, tilt * 0.5);
        group.add(sheet);
      });
    }

    if (kind === 'chart') {
      const heights = [0.42, 0.68, 0.95, 1.28, 1.05];
      heights.forEach((height, i) => {
        const last = i === heights.length - 1;
        const bar = new THREE.Mesh(
          new THREE.BoxGeometry(0.16, height, 0.16),
          new THREE.MeshStandardMaterial({
            color: last ? COLOURS.gold : COLOURS.roof,
            emissive: last ? 0x8a5a10 : 0x0d2419,
            roughness: 0.42,
            metalness: 0.3,
          }),
        );
        bar.position.set(-0.4 + i * 0.2, height / 2, 0);
        group.add(bar);
      });
      const baseline = new THREE.Mesh(
        new THREE.BoxGeometry(1.15, 0.03, 0.24),
        this.standard(COLOURS.metal, 0.5, 0.6),
      );
      baseline.position.y = 0.015;
      group.add(baseline);
    }

    if (kind === 'coins') {
      const coinGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.075, 28);
      [0.05, 0.135, 0.22].forEach((y) => {
        const coin = new THREE.Mesh(
          coinGeometry,
          new THREE.MeshStandardMaterial({ color: COLOURS.gold, roughness: 0.28, metalness: 0.9 }),
        );
        coin.position.y = y;
        group.add(coin);
      });
      const note = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.02, 0.36), this.standard(COLOURS.paper, 0.9));
      note.position.set(0.1, 0.31, 0.02);
      note.rotation.y = 0.2;
      group.add(note);
    }

    return group;
  }

  private buildStations() {
    const stations: { kind: string; angle: number; radius: number; y: number; scale: number }[] = [
      { kind: 'shed', angle: -Math.PI * 0.16, radius: 5.4, y: -0.55, scale: 1.05 },
      { kind: 'eggs', angle: Math.PI * 0.2, radius: 4.7, y: -0.2, scale: 1 },
      { kind: 'feed', angle: Math.PI * 0.62, radius: 5.2, y: -0.5, scale: 0.95 },
      { kind: 'godown', angle: Math.PI * 1.02, radius: 5.5, y: -0.45, scale: 1 },
      { kind: 'paper', angle: -Math.PI * 0.58, radius: 4.6, y: 0.5, scale: 0.9 },
      { kind: 'chart', angle: -Math.PI * 0.86, radius: 4.9, y: 0.15, scale: 0.95 },
      { kind: 'coins', angle: -Math.PI * 0.36, radius: 4.2, y: 0.9, scale: 0.9 },
    ];

    stations.forEach((station, i) => {
      const group = this.buildStation(station.kind);
      const x = Math.cos(station.angle) * station.radius;
      const z = Math.sin(station.angle) * station.radius * 0.62;
      group.position.set(x, station.y, z);
      group.scale.setScalar(station.scale);
      group.rotation.y = -station.angle + Math.PI / 2;
      this.root.add(group);

      const from = new THREE.Vector3(x, station.y + 0.9 * station.scale, z);
      const to = new THREE.Vector3(0, 0.35, 0.35);
      const mid = from.clone().lerp(to, 0.5).add(new THREE.Vector3(0, 1.5 + (i % 3) * 0.35, 0));
      const curve = new THREE.QuadraticBezierCurve3(from, mid, to);

      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 48, 0.008, 5, false),
        new THREE.MeshBasicMaterial({
          color: i % 2 ? COLOURS.steel : COLOURS.goldSoft,
          transparent: true,
          opacity: 0.34,
        }),
      );
      this.root.add(tube);

      const packets = this.high ? 2 : 1;
      for (let p = 0; p < packets; p += 1) {
        const packet = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 10, 8),
          new THREE.MeshBasicMaterial({ color: p ? COLOURS.goldSoft : COLOURS.gold, toneMapped: false }),
        );
        this.root.add(packet);
        this.flows.push({
          curve,
          packet,
          offset: (i * 0.37 + p * 0.5) % 1,
          speed: 0.11 + (i % 4) * 0.018,
        });
      }
    });
  }

  private buildParticles() {
    const count = 260;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 5 + Math.random() * 7;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -2 + Math.random() * 7.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.6;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: 0xffe6b0,
        size: 0.045,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    );
    this.root.add(this.particles);
  }

  // ---- lifecycle ----------------------------------------------------------

  private observeResize() {
    const target = this.canvas.parentElement;
    if (!target || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', this.resize);
      return;
    }
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(target);
  }

  resize = () => {
    const parent = this.canvas.parentElement;
    const width = parent?.clientWidth || window.innerWidth;
    const height = parent?.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / Math.max(1, height);
    // Keep the diorama framed on portrait screens.
    this.camera.fov = width / height < 0.85 ? 52 : 38;
    this.camera.updateProjectionMatrix();
    this.render();
  };

  setPointer(x: number, y: number) {
    this.pointer.set(x, y);
    if (this.reduced) this.render();
  }

  /** 0 → 1 across the hero's scroll: the camera pulls back and the scene tips away. */
  setProgress(value: number) {
    this.progress = value;
    if (this.reduced) this.render();
  }

  private place() {
    this.eased.lerp(this.pointer, this.reduced ? 1 : 0.06);
    const drift = this.reduced ? 0 : Math.sin(this.elapsed * 0.16) * 0.05;

    this.root.rotation.y = -0.16 + drift + this.eased.x * 0.2 + this.progress * 0.5;
    this.root.position.y = -this.progress * 1.1;

    this.camera.position.x = this.eased.x * 0.85;
    this.camera.position.y = 3.2 - this.eased.y * 0.6 + this.progress * 1.8;
    this.camera.position.z = 13.2 + this.progress * 4.2;
    this.camera.lookAt(0, 0.4 - this.progress * 0.6, 0);

    if (!this.reduced) {
      this.phone.position.y = 0.55 + Math.sin(this.elapsed * 0.7) * 0.045;
      this.flows.forEach((flow) => {
        const t = (this.elapsed * flow.speed + flow.offset) % 1;
        flow.curve.getPointAt(t, flow.packet.position);
        const fade = Math.sin(Math.PI * t);
        (flow.packet.material as THREE.MeshBasicMaterial).opacity = 0.25 + fade * 0.75;
        (flow.packet.material as THREE.MeshBasicMaterial).transparent = true;
        flow.packet.scale.setScalar(0.75 + fade * 0.5);
      });
      if (this.particles) this.particles.rotation.y = this.elapsed * 0.02;
    }
  }

  private loop = (now: number) => {
    if (!this.running) return;
    this.elapsed += Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.place();
    this.render();
    this.frame = requestAnimationFrame(this.loop);
  };

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    if (this.running || this.reduced) {
      this.place();
      this.render();
      return;
    }
    this.running = true;
    this.last = performance.now();
    this.frame = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  dispose() {
    this.stop();
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.resize);
    this.textures.forEach((texture) => texture.dispose());
    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose?.();
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
      else material?.dispose?.();
    });
    this.scene.clear();
    this.renderer.dispose();
  }
}
