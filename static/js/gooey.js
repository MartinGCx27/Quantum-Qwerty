// Gooey Image Hover JS
// Aquí podrías añadir animaciones más complejas con JS
// Para este ejemplo básico no es obligatorio JS, pero lo dejo listo.

// gooey.js
(() => {
    class GooeyCard {
      constructor(el) {
        this.el = el;
        this.src = el.getAttribute('data-src');
        this.fallbackImg = el.querySelector('.desafio-fallback');
        this.started = false;
        this.hover = 0; // 0..1
        this.mouse = { x: 0.5, y: 0.5 };
        this.time = 0;
  
        // Evitar iniciar si no hay WebGL
        if (!this.supportsWebGL()) return;
  
        // Intentar iniciar; si falla (CORS), nos quedamos con fallback
        this.init().catch(err => {
          console.warn('Gooey: usando fallback por error de carga:', err);
        });
      }
  
      supportsWebGL() {
        try {
          const canvas = document.createElement('canvas');
          return !!(window.WebGLRenderingContext &&
                   (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) { return false; }
      }
  
      async init() {
        // Setup básico
        const width = this.el.clientWidth;
        const height = this.el.clientHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.setSize(width, height);
        this.canvas = this.renderer.domElement;
        this.el.appendChild(this.canvas);
  
        // Textura
        const tex = await this.loadTexture(this.src);
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.minFilter = THREE.LinearFilter;
  
        // Shaders (grayscale base + máscara “gel” con varios blobs + ruido)
        const vertex = `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `;
  
        const fragment = `
          precision highp float;
          varying vec2 vUv;
          uniform sampler2D uTex;
          uniform vec2 uMouse;   // 0..1
          uniform float uTime;
          uniform float uHover;  // 0..1
  
          float circle(vec2 uv, vec2 p, float r, float blur){
            float d = distance(uv, p);
            return smoothstep(r, r - blur, r - d);
          }
          // ruido barato para borde irregular
          float hash(vec2 p){
            return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);
          }
          float noise(vec2 p){
            vec2 i = floor(p);
            vec2 f = fract(p);
            float a = hash(i);
            float b = hash(i + vec2(1.0,0.0));
            float c = hash(i + vec2(0.0,1.0));
            float d = hash(i + vec2(1.0,1.0));
            vec2 u = f*f*(3.0-2.0*f);
            return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }
  
          void main(){
            vec4 col = texture2D(uTex, vUv);
            // base en B/N
            float g = dot(col.rgb, vec3(0.299, 0.587, 0.114));
            vec3 base = vec3(g);
  
            // blobs alrededor del mouse
            vec2 m = uMouse;
            float b1 = circle(vUv, m, 0.22, 0.08);
            float b2 = circle(vUv, m + vec2( 0.10*sin(uTime*1.10),  0.08*cos(uTime*0.80)), 0.16, 0.07);
            float b3 = circle(vUv, m + vec2(-0.08*cos(uTime*0.90),  0.10*sin(uTime*1.35)), 0.14, 0.06);
            float blob = max(b1, max(b2, b3));
  
            // borde gelatinoso con ruido (frecuencia relativa al tamaño)
            float n = noise(vUv*vec2(12.0, 10.0) + uTime*0.5);
            blob = clamp(blob + (n - 0.5)*0.25, 0.0, 1.0);
  
            // activar solo cuando hay hover
            float t = smoothstep(0.35, 0.55, blob) * uHover;
  
            vec3 finalCol = mix(base, col.rgb, t);
            gl_FragColor = vec4(finalCol, 1.0);
          }
        `;
  
        this.uniforms = {
          uTex:   { value: tex },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uTime:  { value: 0 },
          uHover: { value: 0 }
        };
  
        this.mat = new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: vertex,
          fragmentShader: fragment,
          transparent: true
        });
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, this.mat);
        this.scene.add(mesh);
  
        this.bindEvents();
        this.onResize();
        this.tick();
  
        // Si llegó hasta aquí, ocultamos el fallback
        if (this.fallbackImg) this.fallbackImg.style.visibility = 'hidden';
        this.started = true;
      }
  
      loadTexture(src){
        return new Promise((resolve, reject) => {
          const loader = new THREE.TextureLoader();
          loader.setCrossOrigin('anonymous');
          loader.load(
            src,
            texture => resolve(texture),
            undefined,
            err => reject(err)
          );
        });
      }
  
      bindEvents(){
        this._onEnter = () => this.toHover(1);
        this._onLeave = () => this.toHover(0);
        this._onMove  = (e) => {
          const r = this.el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = 1.0 - (e.clientY - r.top) / r.height;
          this.uniforms.uMouse.value.set(x, y);
        };
        this._onResize = () => this.onResize();
  
        this.el.addEventListener('pointerenter', this._onEnter);
        this.el.addEventListener('pointerleave', this._onLeave);
        this.el.addEventListener('pointermove',  this._onMove);
        window.addEventListener('resize', this._onResize);
      }
  
      toHover(target){
        // con GSAP para easing suave
        if (window.gsap) {
          gsap.to(this.uniforms.uHover, { value: target, duration: 0.45, ease: 'power2.out' });
        } else {
          this.uniforms.uHover.value = target;
        }
      }
  
      onResize(){
        if (!this.renderer) return;
        const w = this.el.clientWidth;
        const h = this.el.clientHeight;
        this.renderer.setSize(w, h, false);
      }
  
      tick(){
        this.time += 0.016;
        if (this.uniforms) this.uniforms.uTime.value = this.time;
        this.renderer && this.renderer.render(this.scene, this.camera);
        this._raf = requestAnimationFrame(this.tick.bind(this));
      }
    }
  
    // Inicializar todas las tarjetas
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.desafio-item').forEach(el => new GooeyCard(el));
      console.log('✅ Gooey Hover (Three.js) inicializado');
    });
  })();
  