import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

window.addEventListener('load', function() {
    init()
})

function init() {
    const renderer = new THREE.WebGLRenderer({
        // alpha: true
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
        10000
    )
    
    camera.position.z = 5

    const controls = new OrbitControls(camera, renderer.domElement)

    controls.minDistance = 5
    controls.maxDistance = 1000

    const textureloader = new THREE.TextureLoader().setPath("../src/assets/textures/Yocohama/")

    const images = [
        'posx.jpg', 'negx.jpg',
        'posy.jpg', 'negy.jpg',
        'posz.jpg', 'negz.jpg',
    ]

    const geometry = new THREE.BoxGeometry(5000, 5000, 5000)
    const materials = images.map(image => new THREE.MeshBasicMaterial({
        map: textureloader.load(image),
        side: THREE.BackSide
    }))

    const skyBox = new THREE.Mesh(geometry, materials)

    scene.add(skyBox)
    
    render()

    function render() {
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