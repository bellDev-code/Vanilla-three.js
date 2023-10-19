import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import GUI from "lil-gui"

window.addEventListener('load', function() {
    init()
})

async function init() {
    const gui = new GUI()

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
    
    camera.position.set(0, 1, 5)

    new OrbitControls(camera, renderer.domElement)

    const fontLoader = new FontLoader()

    const font = await fontLoader.loadAsync("../src/assets/fonts/The Jamsil 3 Regular_Regular.json")
    const textGeometry = new TextGeometry("이학근 술쟁이", {
        font,
        size: 0.5,
        height: 0.1,
        bevelEnabled: true,
        bevelSegments: 5,
        bevelSize: 0.02,
        bevelThickness: 0.02
    })
    const textMaterial = new THREE.MeshPhongMaterial()

    const text = new THREE.Mesh(textGeometry, textMaterial)

    text.castShadow = true

    scene.add(text)

    const planeGeometry = new THREE.PlaneGeometry(2000, 2000)
    const planeMaterial = new THREE.MeshPhongMaterial({color: "#000000"})
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)

    plane.position.z = -10
    plane.receiveShadow = true

    scene.add(plane)

    // 단순히 텍스트 정렬을 위한다면 밑의 코드가 간편
    textGeometry.center()

    const textureLoader = new THREE.TextureLoader().setPath('../src/assets/textures/')
    const texture = textureLoader.load('holographic.jpeg')

    textMaterial.map = texture

    // computeBoundingBox를 이용하여 텍스트 가운데 정렬
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     // x축 기준으로 가운데로
    //     -(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) * 0.5,
    //     -(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) * 0.5,
    //     -(textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z) * 0.5
    // )

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.2)
    scene.add(ambientLight)

    const spotLight = new THREE.SpotLight("#ffffff", 20, 30, Math.PI * 0.15, 0.2, 0.5)
    
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.radius = 10

    spotLight.position.set(0, 0, 3)
    spotLight.target.position.set(0, 0, -3)

    const spotLightTexture = textureLoader.load('gradient.jpg')
    spotLight.map = spotLightTexture

    scene.add(spotLight, spotLight.target)

    window.addEventListener('mousemove', event => {
        const x = ((event.clientX / window.innerWidth) - 0.5) * 5
        const y = -(((event.clientY / window.innerHeight) - 0.5) * 5)

        spotLight.target.position.set(x, y, -3)
    })

    const spotLightFolder = gui.addFolder('SpotLight')
    spotLightFolder.add(spotLight, 'angle').min(0).max(Math.PI/2).step(0.01)
    spotLightFolder.add(spotLight.position, 'z').min(1).max(10).step(0.01).name('position.z')
    spotLightFolder.add(spotLight, 'distance').min(1).max(30).step(0.01)
    spotLightFolder.add(spotLight, 'decay').min(0).max(10).step(0.01)
    spotLightFolder.add(spotLight, 'penumbra').min(0).max(1).step(0.01)
    spotLightFolder.add(spotLight.shadow, 'radius').min(1).max(20).step(0.01).name('shadow.radius')
    
    const composer = new EffectComposer(renderer)

    const renderPass = new RenderPass(scene, camera)

    composer.addPass(renderPass)

    const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 1, 0)

    composer.addPass(unrealBloomPass)

    const unrealBloomPassFolder = gui.addFolder('UnrealBloomPass')

    unrealBloomPassFolder.add(unrealBloomPass, "strength").min(0).max(3).step(0.01)
    unrealBloomPassFolder.add(unrealBloomPass, "radius").min(0).max(1).step(0.01)
    unrealBloomPassFolder.add(unrealBloomPass, "threshold").min(0).max(1).step(0.01)

    render()

    function render() {
        composer.render()

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