import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Firework from "./FireWork"

window.addEventListener('load', function() {
    init()
})

function init() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // 장면
    const scene = new THREE.Scene()
    
    // 카메라
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        500
    )

    camera.position.z = 5

    new OrbitControls(camera, renderer.domElement)

    const firework = new Firework({ x: 0, y: 0})
    
    scene.add(firework.points)
    
    render()

    function render() {
        firework.update()
        
        renderer.render(scene, camera)

        requestAnimationFrame(render)
    }

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)

        renderer.render()

    }

    window.addEventListener('resize', handleResize)

}