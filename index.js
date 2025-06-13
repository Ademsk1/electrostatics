import * as THREE from 'three'
import { OrbitControls } from 'jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
new OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const width = 10
const height = 10
const segmentsX = 100
const segmentsY = 100

const geometry = new THREE.PlaneGeometry(width, height, segmentsX,segmentsY )



const material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true})



const line = new THREE.Mesh( geometry, material );
scene.add( line );

camera.position.z = 3;

// Animation loop
function animate(t=0) {
    requestAnimationFrame(()=> animate(t));
    const p = geometry.attributes.position
    for (let i=0;i<p.count;i++) {
        let x = p.getX(i)
        let y = p.getY(i)
        const z = Math.sin((x+y) -t*3)
        p.setZ(i, z)
    }
    t+=0.001
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    p.needsUpdate = true
    renderer.render(scene, camera);
}
const t = 0
animate(t);

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
