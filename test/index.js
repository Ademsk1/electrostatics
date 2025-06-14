import * as THREE from 'three'
import { OrbitControls } from 'jsm/controls/OrbitControls.js';


let type = "Sinusoidal"

const form = document.querySelector("form")
const log = document.querySelector("#log")

form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    const data = new FormData(form);
    let output = "";
    console.log({data})
    for (const entry of data) {
      output = `${entry[1]}\r`;
    }
    log.innerText = output
    console.log(output)
    type = output.trim()

  },
  false,
);


const f = (x) => {
    efield = getElectricField()

}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const hemiLight = new THREE.HemisphereLight(0xffff44, 0xffffff)
scene.add(hemiLight)
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
const material = new THREE.MeshBasicMaterial({color: 0x777777, wireframe: true,})



const newShape = () => {
    const group = new THREE.Group()

    const sphere = new THREE.IcosahedronGeometry(0.1, 20)
    const matElectron = new THREE.MeshStandardMaterial({color: 0xff0000})
    const matProton = new THREE.MeshStandardMaterial({color: 0x0000ff})

    const electron = new THREE.Mesh(sphere, matElectron)
    const proton = new THREE.Mesh(sphere, matProton)

    proton.position.set(1, 0, 2)
    electron.position.set(-1,0,2)
    group.add(proton)
    group.add(electron)
    return group
}


const group = newShape()

scene.add(group)


const getElectricField = () => {
    if (type === "Sinusoidal") {
        return [0,1]
    }
    console.log(type.toLowerCase())
    switch (type.toLowerCase()) {
        case "sinusoidal":
            return [0,1]
        case "linear": 
            return [1,0]
        default:
            return [0,0]
    }
}

const line = new THREE.Mesh( geometry, material );
scene.add( line );

camera.position.z = 3;
const electronPosition = group.children[0].position 
const protonPosition = group.children[1].position
console.log({electronPosition})
console.log(group)
// Animation loop

function animate(t=0) {
    const efield = getElectricField()
    console.log(efield)
    requestAnimationFrame(()=> animate(t));
    const p = geometry.attributes.position
    for (let i=0;i<p.count;i++) {
        let x = p.getX(i)
        let y = p.getY(i)
        const z = Math.sin((x) -t*3)*efield[1] + x*efield[0]
        p.setZ(i, z)
        
    }
    electronPosition.z = Math.sin(electronPosition.x - t*3)
    protonPosition.z = Math.sin(protonPosition.x - t*3)
    t+=0.001
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
