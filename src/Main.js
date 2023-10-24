import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

window.addEventListener('load', function() {
    init()
})

async function init() {
    const renderer = new THREE.WebGLRenderer({
        // alpha: true
        antialias: true
    })

    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.shadowMap = true

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
    
    camera.position.set(0, 5, 20)

    const controls = new OrbitControls(camera, renderer.domElement)

    controls.enableDamping = true
    controls.minDistance = 15
    controls.maxDistance = 25
    controls.minPolarAngle = Math.PI / 4
    controls.maxPolarAngle = Math.PI / 3

    const progressBar = document.querySelector('#progress-bar')
    const progressContainer = document.querySelector('#progress-bar-container')

    const loadingManager = new THREE.LoadingManager()

    loadingManager.onProgress = (url, loaded, total) => {
        progressBar.value = (loaded / total) * 100
    }
    
    loadingManager.onLoad = () => {
        progressContainer.style.display = 'none'
    }

    const gltfLoader = new GLTFLoader(loadingManager)

    const gltf = await gltfLoader.loadAsync('../src/models/3Dmodel/character.gltf')

    const model = gltf.scene

    scene.add(model)

    camera.lookAt(model.position)

    model.scale.set(0.1, 0.1, 0.1)

    const planeGeometry = new THREE.PlaneGeometry(10000, 10000, 10000)
    const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
    })

    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -7.5

    scene.add(plane)

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333)

    hemisphereLight.position.set(0, 20, 10)

    scene.add(hemisphereLight)

    const spotLight = new THREE.SpotLight(0xffffff, 30, Math.PI * 0.15, 0.5, 0.5)

    spotLight.position.set(0, 20, 0)

    scene.add(spotLight)
    
    render()

    function render() {
        controls.update()

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