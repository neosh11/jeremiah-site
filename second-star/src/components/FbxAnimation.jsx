// src/components/FbxAnimation.jsx
import { onMount, onCleanup } from 'solid-js';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const FbxAnimation = () => {
  let containerRef;
  let mixer; // Animation mixer
  let clock;

  onMount(() => {
    // **Initialize Scene, Camera, and Renderer**
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(100, 200, 300);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // Append renderer to the container
    containerRef.appendChild(renderer.domElement);

    // **Add Lights**
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    scene.add(dirLight);

    // **Add Ground**
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // **Add Grid Helper**
    const grid = new THREE.GridHelper(1000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    // **Initialize Clock for Animations**
    clock = new THREE.Clock();

    // **Initialize OrbitControls**
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 100, 0); // Adjust based on your model's position
    controls.update();

    // **Load FBX Model**
    const loader = new FBXLoader();
    loader.load(
      '/graph/jerry.fbx', // Ensure this path is correct
      (object) => {
        
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('/graph/material_0.png');
        texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // **Assign the Texture Manually**
            if (child.material) {
              child.material.map = texture;
              child.material.needsUpdate = true;
            }
          }
        });

        scene.add(object);

        // **Set Up Animation Mixer**
        mixer = new THREE.AnimationMixer(object);
        if (object.animations.length > 0) {
          const action = mixer.clipAction(object.animations[0]);
          action.play();
        }

        // **Animation Loop**
        const animate = () => {
          requestAnimationFrame(animate);

          const delta = clock.getDelta();
          if (mixer) mixer.update(delta);

          controls.update(); // Update controls

          renderer.render(scene, camera);
        };

        animate();
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the FBX model:', error);
      }
    );

    // **Handle Window Resize**
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // **Cleanup Function**
    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
      containerRef.removeChild(renderer.domElement);
      renderer.dispose();
      if (mixer) mixer.uncacheRoot(mixer.getRoot());
    });
  });

  return (
    // <div
    //   ref={el => (containerRef = el)}
    //   style={{ width: '100%', height: '100vh' }}
    // ></div>
    null
  );
};

export default FbxAnimation;
