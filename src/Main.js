import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import GUI from "lil-gui"

window.addEventListener('load', function() {
    init()
})

async function init() {
    const gui = new GUI()

    const canvas = document.querySelector('#canvas')

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas
    })

    renderer.shadowMap.enabled = true

    renderer.setSize(window.innerWidth, window.innerHeight)

    // 장면
    const scene = new THREE.Scene()

    scene.fog = new THREE.Fog(0xf0f0f0, 0.1, 500)

    gui.add(scene.fog, 'near').min(0).max(100).step(0.01)
    gui.add(scene.fog, 'far').min(100).max(500).step(0.1)
    
    // 카메라
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        500
    )

    camera.position.set(0, 25, 150)

    const waveGeometry = new THREE.PlaneGeometry(1500, 1500, 150, 150)
    const waveMaterial = new THREE.MeshStandardMaterial({
        color: "#00ffff"
    })

    const wave = new THREE.Mesh(waveGeometry, waveMaterial)
    
    wave.rotation.x = -Math.PI / 2

    wave.receiveShadow = true

    const waveHight = 3;
    const initialZPositions = []

    for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
        const z = waveGeometry.attributes.position.getZ(i) + (Math.random() - 0.5) * waveHight;

        waveGeometry.attributes.position.setZ(i, z)
        initialZPositions.push(z)
    }

    wave.update = function() {
        const elapsedTime = clock.getElapsedTime()

        for (let i = 0; i < waveGeometry.attributes.position.count; i += 3) {
            const z = initialZPositions[i] + Math.sin(elapsedTime * 3 + i ** 2) * waveHight
            
            
            waveGeometry.attributes.position.setZ(i, z)
        }

        waveGeometry.attributes.position.needsUpdate = true
    }

    scene.add(wave)

    const gltfLoader = new GLTFLoader()

    const gltf = await gltfLoader.loadAsync('../src/models/ship/scene.gltf')

    const ship = gltf.scene

    ship.castShadow = true

    ship.traverse(object => {
        if(object.isMesh) {
            object.castShadow = true
        }
    })

    ship.update = function() {
        const elapsedTime = clock.getElapsedTime()

        ship.position.y = Math.sin(elapsedTime * 3)
    }

    ship.rotation.y = -Math.PI/ 3.5

    ship.scale.set(5, 5, 5)

    scene.add(ship)
    
    const pointLight = new THREE.PointLight(0xffffff, 1)

    pointLight.castShadow = true
    pointLight.shadow.mapSize.width = 1024
    pointLight.shadow.mapSize.height = 1024
    pointLight.shadow.radius = 10

    pointLight.position.set(15, 15, 15)
    
    scene.add(pointLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)

    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.radius = 10

    directionalLight.position.set(-15, 15, 15)

    scene.add(directionalLight)

    const clock = new THREE.Clock()

    render();

    function render() {
        wave.update()
        ship.update()
        
        camera.lookAt(ship.position)

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    window.addEventListener('resize', handleResize);
}