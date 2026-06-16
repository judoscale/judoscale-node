// The hosting platform we detected from the environment. The container/instance
// id is just one property of the platform — behavior that only applies to
// certain platforms (whether an instance is a redundant member of a formation,
// or an ephemeral process) lives on the platform subclasses that actually have
// those concepts, instead of being re-derived from the shape of the container
// string.
class Platform {
  constructor(container) {
    this.container = container == null ? '' : String(container)
  }

  // Most platforms expose opaque, non-ordinal instance ids (Render, ECS, Fly,
  // Railway, custom), so by default no instance is redundant or ephemeral.
  // Platforms that have those concepts override these.
  redundantInstance() {
    return false
  }

  ephemeralInstance() {
    return false
  }

  // Detect the current platform from the environment. Order matters: an explicit
  // JUDOSCALE_CONTAINER always wins, and Unknown is the fallback.
  static detect(env = process.env) {
    if (env.JUDOSCALE_CONTAINER) {
      return new Custom(env.JUDOSCALE_CONTAINER)
    } else if (env.DYNO) {
      return new Heroku(env.DYNO)
    } else if (env.RENDER_INSTANCE_ID) {
      return new Render(env.RENDER_INSTANCE_ID, env.RENDER_SERVICE_ID)
    } else if (env.ECS_CONTAINER_METADATA_URI) {
      return new Ecs(env.ECS_CONTAINER_METADATA_URI.split('/').pop())
    } else if (env.FLY_MACHINE_ID) {
      return new Fly(env.FLY_MACHINE_ID)
    } else if (env.RAILWAY_REPLICA_ID) {
      return new Railway(env.RAILWAY_REPLICA_ID)
    } else if (env.CONTAINER) {
      // Scalingo exposes the container type and index (e.g. "web-1") via CONTAINER.
      return new Scalingo(env.CONTAINER)
    } else {
      return new Unknown('')
    }
  }
}

// Heroku dynos are named "web.2". We collect job metrics from a single
// container per process type, so any instance beyond the first is redundant —
// it would only duplicate the queue metrics the first instance already reports.
class Heroku extends Platform {
  redundantInstance() {
    const match = this.container.match(/^[a-z_]+\.(\d+)$/)
    return match ? parseInt(match[1], 10) > 1 : false
  }

  // Heroku release phase and one-off dynos are named "release.1234" and "run.1234".
  ephemeralInstance() {
    const container = this.container.toLowerCase()
    return container.startsWith('release.') || container.startsWith('run.')
  }
}

// Scalingo containers are named "web-2", same redundancy rule as Heroku.
class Scalingo extends Platform {
  redundantInstance() {
    const match = this.container.match(/^[a-z_]+-(\d+)$/)
    return match ? parseInt(match[1], 10) > 1 : false
  }

  // Scalingo one-off containers are named "one-off-1234".
  ephemeralInstance() {
    return this.container.startsWith('one-off-')
  }
}

class Render extends Platform {
  constructor(instanceId, serviceId) {
    // Render prefixes the instance id with the service id, which isn't part of the instance.
    const prefix = `${serviceId}-`
    const container = serviceId && instanceId.startsWith(prefix) ? instanceId.slice(prefix.length) : instanceId
    super(container)
  }
}

class Ecs extends Platform {}

class Fly extends Platform {}

class Railway extends Platform {}

// User-provided container id via JUDOSCALE_CONTAINER.
class Custom extends Platform {}

// Unsupported or undetected platform.
class Unknown extends Platform {}

Object.assign(Platform, { Heroku, Scalingo, Render, Ecs, Fly, Railway, Custom, Unknown })

module.exports = Platform
