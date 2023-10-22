import * as THREE from "three"
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
        10000
    )

    camera.position.z = 8000

    const fireworks = []

    fireworks.update = function() {
        for (let i = 0; i < this.length; i++) {
            const firework = fireworks[i]
            
            firework.update()
        }
    }

    const firework = new Firework({ x: 0, y: 0})
    
    scene.add(firework.points)

    fireworks.push(firework)
    
    render()

    function render() {
        fireworks.update()

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

    function handleMouseDown() {
        const firework = new Firework({
            x: THREE.MathUtils.randFloatSpread(8000),
            y: THREE.MathUtils.randFloatSpread(8000)
        })

        scene.add(firework.points)

        fireworks.push(firework)
    }

    window.addEventListener('mousedown', handleMouseDown)
}