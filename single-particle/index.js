import * as THREE from 'three'
import { OrbitControls } from 'jsm/controls/OrbitControls.js';




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const hemiLight = new THREE.HemisphereLight(0xffff44, 0x00ffff)
scene.add(hemiLight)
const renderer = new THREE.WebGLRenderer({ antialias: true });
new OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
camera.position.z = 10



const particle = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 5),
    new THREE.MeshStandardMaterial({color: 0xa405b0, flatShading: true})
)


const arrowsOut = (origin, number, length=2, type="arrow") => {
    let dir
    let phi
    let theta
    const material = new THREE.LineDashedMaterial( {
        color: 0xffffff,
        linewidth: 1,
        scale: 1,
        dashSize: 3,
        gapSize: 1,
    });
    const group = new THREE.Group()
    for (let i =0;i<number;i++) {
         phi = (2*Math.PI / number) * i 
         for (let j=0;j<number;j++) {
            theta = (Math.PI / number) * j
            dir = new THREE.Vector3(
                Math.sin(theta) * Math.sin(phi),
                Math.sin(theta) * Math.cos(phi),
                Math.cos(theta)
                )
            let arr
            if (type === "arrow") {
                arr = new THREE.ArrowHelper(dir, origin, length, 0x999999)
            }
            else {

                arr = new THREE.Line(new THREE.BufferGeometry().setFromPoints(
                   [ origin, dir.multiplyScalar(100)]), material
                )
            }
            arr.userData.direction = dir
            group.add(
            arr
        )
         }
    }
    return group


}   

const arrs = []
for (let i=0;i<10;i++) {
    arrs.push(arrowsOut(particle.position, 5))
} 
const MAX_RADIUS = 10
let arrows = arrowsOut(particle.position, 5)
console.log({arrows})
let constantArrows = arrowsOut(particle.position, 5, MAX_RADIUS, "line")
arrs.forEach((_, i)=> {
    scene.add(arrs[i])
})
scene.add(constantArrows)

scene.add(particle)
// Animation loop
renderer.render(scene, camera);

function animate(t=0) {
    arrs.forEach((arrowGroup,i) => {
        const pos = arrowGroup.children[0].position
        const r = Math.sqrt(pos.x**2 + pos.y**2 + pos.z **2)
        if (r > MAX_RADIUS) {
            arrowGroup.children.forEach((arrow)=> {
            arrow.position.set(0,0,0)
            })
        }
        console.log(t)
        const modifier = t > i*0.2
        arrowGroup.children.forEach((arrow)=> {
            if (modifier) {
            const {x,y,z} = arrow.position
            const {x:xd, y:yd, z:zd} = arrow.userData.direction
            arrow.position.set(
                x + xd * 0.01,
                y + yd * 0.01,
                z + zd * 0.01
            )
            }

            // arrow.position.x += arrow.userData.direction.x * 0.01 * modifier
            // arrow.position.y += arrow.userData.direction.y * 0.01 * modifier
            // arrow.position.z += arrow.userData.direction.z * 0.01 * modifier
        })
    })
    // arrows.children.forEach((arrow)=> {
    //     if (r > 5) {
    //         arrow.position.x = 0
    //         arrow.position.y = 0
    //         arrow.position.z = 0
    //     }
    //     arrow.position.x += arrow.userData.direction.x * 0.01
    //     arrow.position.y += arrow.userData.direction.y * 0.01
    //     arrow.position.z += arrow.userData.direction.z * 0.01
    // })
    requestAnimationFrame(()=> animate(t));
    t+=0.001
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
