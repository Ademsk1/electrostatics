




const K = 8.99e9





class Particle {
    constructor(id, position, velocity, charge) {
        this.id
        this.position = position
        this.velocity = velocity
        this.charge = charge
    }
}


class System {
    constructor(particles) {
        this.particles = particles
    }

    addParticle(particle) {
        this.particles.push(particle)
    }

    getParticle(id) {
        return this.particles.find((particle)=> particle.id === id)
    }

    removeParticle(id) {
        const idx = this.particles.findIndex((particle)=> particle.id === id)
        return this.particles.splice(idx, 1)
    }
    // Force on one particle
    forceOn(id) {
        const particleOfInterest = this.getParticle(id)
        const {x:x1,y:y1,z:z1} = particleOfInterest.position

        const forceSum = []
        let force = []
        let q1
        let vector
        let mag
        let q2 = particleOfInterest.charge
        this.particles.forEach((particle)=> {
            if (particle.id !== id ) {
                q1 = particle.charge
                const {x:x2,y:y2,z:z2} = particle.position
                const xdiff = x1-x2
                const ydiff = y1-y2
                const zdiff = z1-z2

                mag = Math.sqrt(xdiff**2 + ydiff**2 + zdiff**2)

                const Fmag = (K * q1 * q2) / mag
                vector = [
                    Fmag * 1
                ]

            }
        })
    }

}