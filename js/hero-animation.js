// vanta-net-animation.js

// Ensure THREE.js is loaded before this script
// <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r148/three.min.js"></script>

(function(global) {
  "use strict";

  // VantaBase and NET effect
  var VANTA = global.VANTA || {};
  global.VANTA = VANTA;

  // Utility functions
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 600;
  }

  function randRange(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  function disposeObject(obj) {
    if (!obj) return;
    if (obj.children) while (obj.children.length) disposeObject(obj.children[0]);
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      Object.values(obj.material).forEach(m => m && typeof m.dispose === "function" && m.dispose());
      obj.material.dispose();
    }
  }

  class VantaBase {
    constructor(options = {}) {
      if (!global.THREE) return console.warn("THREE.js not loaded!");
      this.options = Object.assign({
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1
      }, options);

      if (typeof this.options.el === "string") {
        this.el = document.querySelector(this.options.el);
      } else {
        this.el = this.options.el;
      }

      if (!this.el) return console.error("VANTA: No element found for el option");

      this.prepareEl();
      this.initThree();
      this.setSize();
      try {
        this.init();
      } catch (e) {
        console.error("VANTA init error", e);
        if (this.renderer && this.renderer.domElement) this.el.removeChild(this.renderer.domElement);
        if (this.options.backgroundColor) this.el.style.background = this.options.backgroundColor;
      }

      this.initMouse();
      this.resize();
      this.animationLoop();

      window.addEventListener("resize", this.resize.bind(this));
      if (this.options.mouseControls) {
        window.addEventListener("scroll", this.windowMouseMoveWrapper.bind(this));
        window.addEventListener("mousemove", this.windowMouseMoveWrapper.bind(this));
      }
      if (this.options.touchControls) {
        window.addEventListener("touchstart", this.windowTouchWrapper.bind(this));
        window.addEventListener("touchmove", this.windowTouchWrapper.bind(this));
      }
      if (this.options.gyroControls) {
        window.addEventListener("deviceorientation", this.windowGyroWrapper.bind(this));
      }
    }

    prepareEl() {
      this.el.style.position = "relative";
    }

    initThree() {
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.el.appendChild(this.renderer.domElement);
      this.renderer.domElement.style.position = "absolute";
      this.renderer.domElement.style.zIndex = 0;
      this.renderer.domElement.style.top = 0;
      this.renderer.domElement.style.left = 0;
      this.scene = new THREE.Scene();
    }

    setSize() {
      this.width = Math.max(this.el.offsetWidth, this.options.minWidth);
      this.height = Math.max(this.el.offsetHeight, this.options.minHeight);
      this.scale = isMobile() && this.options.scaleMobile ? this.options.scaleMobile : this.options.scale;
      if (this.renderer) this.renderer.setSize(this.width, this.height);
    }

    initMouse() {
      this.mouseX = this.width / 2;
      this.mouseY = this.height / 2;
    }

    windowMouseMoveWrapper(e) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        this.mouseX = x;
        this.mouseY = y;
      }
    }

    windowTouchWrapper(e) {
      if (e.touches.length === 1) {
        this.windowMouseMoveWrapper(e.touches[0]);
      }
    }

    windowGyroWrapper(e) {
      // Optional gyro effect
    }

    animationLoop() {
      this.update && this.update();
      if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.animationLoop.bind(this));
    }

    destroy() {
      window.cancelAnimationFrame(this.req);
      disposeObject(this.scene);
      if (this.renderer && this.renderer.domElement) this.el.removeChild(this.renderer.domElement);
      this.scene = this.renderer = null;
    }
  }

  // NET effect
  class NET extends VantaBase {
    constructor(options) {
      super(options);
      this.defaultOptions = { color: 0xff9933, backgroundColor: 0x229919, points: 10, maxDistance: 20, spacing: 15, showDots: true };
    }

    init() {
      const p = this.options.points;
      const spacing = this.options.spacing;
      this.pointsArr = [];

      // create camera
      this.camera = new THREE.PerspectiveCamera(25, this.width / this.height, 0.01, 1000);
      this.camera.position.set(50, 100, 150);
      this.scene.add(this.camera);

      // lights
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.75));
      const spot = new THREE.SpotLight(0xffffff, 1);
      spot.position.set(0, 200, 0);
      this.scene.add(spot);

      // create points
      for (let i = 0; i <= p; i++) {
        for (let j = 0; j <= p; j++) {
          const px = (i - p / 2) * spacing + randRange(-5, 5);
          const py = randRange(-3, 3);
          const pz = (j - p / 2) * spacing + randRange(-5, 5);
          const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), new THREE.MeshLambertMaterial({ color: this.options.color }));
          sphere.position.set(px, py, pz);
          this.scene.add(sphere);
          this.pointsArr.push(sphere);
        }
      }
    }

    update() {
      // Simple rotation for demonstration
      this.pointsArr.forEach(p => {
        p.rotation.x += 0.01;
        p.rotation.y += 0.01;
      });
    }
  }

  VANTA.register = function(name, Effect) {
    VANTA[name] = (el, options) => new Effect(Object.assign({ el }, options));
  };

  VANTA.register("NET", NET);

})(window);

/* Usage:
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r148/three.min.js"></script>
<script src="vanta-net-animation.js"></script>
<script>
  VANTA.NET({
    el: "#hero-section",
    color: 0xff9933,
    backgroundColor: 0x229919,
    points: 12,
    spacing: 18
  });
</script>
*/
