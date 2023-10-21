import * as THREE from "three"

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
        500
    )
    
    render()

    function render() {
        renderer.render(scene, camera)

        controls.update()

        requestAnimationFrame(render)
    }

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)

        renderer.render()

        controls.update()
    }

    window.addEventListener('resize', handleResize)

}