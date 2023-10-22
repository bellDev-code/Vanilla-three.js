import * as THREE from "three"

class Firework {
    constructor({x, y}) {
        const count = 1000 + Math.round(Math.random() * 5000)
        const velocity = 10 + Math.random() * 10

        const particleGeometry = new THREE.BufferGeometry()

        this.particles = []

        for (let i = 0; i < count; i++) {
            const particle = new THREE.Vector3(x, y, 0);

            // 구면 좌표계를 직교 좌표계로 변경하는 방법
            particle.theta = Math.random() * Math.PI * 2
            particle.phi = Math.random() * Math.PI * 2

            particle.deltaX = velocity * Math.sin(particle.theta) * Math.cos(particle.phi)
            particle.deltaY = velocity * Math.sin(particle.theta) * Math.sin(particle.phi)
            particle.deltaZ = velocity * Math.cos(particle.theta)

            // 하나의 원 파티클 (구글 : 원의 좌표 구하기 참고)
            // particle.theta = Math.random() * Math.PI * 2
            // particle.deltaX = velocity * Math.cos(particle.theta)
            // particle.deltaY = velocity * Math.sin(particle.theta)
            // particle.deltaZ = 0

            // 육각면체 파티클
            // particle.deltaX = THREE.MathUtils.randFloatSpread(velocity)
            // particle.deltaY = THREE.MathUtils.randFloatSpread(velocity)
            // particle.deltaZ = THREE.MathUtils.randFloatSpread(velocity)
            
            this.particles.push(particle)
        }

        particleGeometry.setFromPoints(this.particles)

        const textureLoader = new THREE.TextureLoader()

        const texture = textureLoader.load("../src/assets/textures/particle.png")

        const particleMaterial = new THREE.PointsMaterial({
            size: 1,
            alphaMap: texture,
            transparent: true,
            depthWrite: false,
            color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            blending: THREE.AdditiveBlending
        })

        const points = new THREE.Points(particleGeometry, particleMaterial)

        this.points = points
    }

    update() {
        const position = this.points.geometry.attributes.position

        for (let i = 0; i < this.particles.length; i++) {
            const x = position.getX(i)
            const y = position.getY(i)
            const z = position.getZ(i)

            position.setX(i, x + this.particles[i].deltaX)
            position.setY(i, y + this.particles[i].deltaY)
            position.setZ(i, z + this.particles[i].deltaZ)
        }

        position.needsUpdate = true
    }
}

export default Firework