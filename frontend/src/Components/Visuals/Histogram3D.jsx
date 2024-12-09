import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PropTypes from 'prop-types';

const Histogram3D = ({ data }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!data || !mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Helper function to create a 3D bar
    const createBar = (x, height, color) => {
      const geometry = new THREE.BoxGeometry(0.8, height, 0.8);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(color),
        specular: 0x111111,
        shininess: 30,
      });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = x;
      bar.position.y = height / 2;
      bar.castShadow = true;
      bar.receiveShadow = true;
      return bar;
    };

    // Base platform
    const platformGeometry = new THREE.PlaneGeometry(10, 10);
    const platformMaterial = new THREE.MeshPhongMaterial({
      color: 0xeeeeee,
      side: THREE.DoubleSide
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.rotation.x = -Math.PI / 2;
    platform.receiveShadow = true;
    scene.add(platform);

    // Add bars
    const maxValue = Math.max(...data.map(item => item.value));
    data.forEach((item, index) => {
      const normalizedHeight = (item.value / maxValue) * 5; // Scale height to reasonable size
      const bar = createBar(
        index * 1.2 - (data.length * 1.2) / 2,
        normalizedHeight,
        item.color
      );
      scene.add(bar);

      // Add text label
      const textTexture = new THREE.CanvasTexture(createTextTexture(item.name));
      const textMaterial = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      const textGeometry = new THREE.PlaneGeometry(1, 0.3);
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(bar.position.x, -0.2, 0.5);
      textMesh.rotation.x = -Math.PI / 4;
      scene.add(textMesh);
    });

    // Helper function to create text texture
    function createTextTexture(text) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 64;
      context.fillStyle = '#000000';
      context.font = '24px Arial';
      context.textAlign = 'center';
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      return canvas;
    }

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [data]);

  return <div ref={mountRef} className="w-full h-full" />;
};

Histogram3D.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Histogram3D;