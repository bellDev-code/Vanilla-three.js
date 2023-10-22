import * as THREE from "three"

class Firework {
    constructor({x, y}) {
        const count = 1000

        const particleGeometry = new THREE.BufferGeometry()

        const particles = []

        for (let i = 0; i < count; i++) {
            const particle = new THREE.Vector3(x, y, 0);
            
            particles.push(particle)
        }

        particleGeometry.setFromPoints(particles)

        const textureLoader = new THREE.TextureLoader()

        const texture = textureLoader.load("../src/assets/textures/particle.png")

        const particleMaterial = new THREE.PointsMaterial({
            size: 1,
            alphaMap: texture,
            transparent: true,
            depthWrite: false,
            color: new THREE.Color(Math.random(), Math.random(), Math.random())
        })

        const points = new THREE.Points(particleGeometry, particleMaterial)

        this.points = points
    }

    update() {}
}

export default Firework