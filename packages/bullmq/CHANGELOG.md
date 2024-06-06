# Changelog

## [2.1.4](https://github.com/judoscale/judoscale-node/compare/judoscale-bullmq-v2.1.3...judoscale-bullmq-v2.1.4) (2024-06-06)


### Bug Fixes

* Include prioritized jobs in queue depth metric ([#45](https://github.com/judoscale/judoscale-node/issues/45)) ([cdc26c5](https://github.com/judoscale/judoscale-node/commit/cdc26c5ec9e6c71db1915c2a6652f6e59f696c0c))

## [2.1.3](https://github.com/judoscale/judoscale-node/compare/judoscale-bullmq-v2.1.2...judoscale-bullmq-v2.1.3) (2024-06-04)


### Bug Fixes

* Add `redis` config option for Bull & BullMQ ([#43](https://github.com/judoscale/judoscale-node/issues/43)) ([bb57dbd](https://github.com/judoscale/judoscale-node/commit/bb57dbd93cce930af872112a4a00c468d28fbc33))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * judoscale-node-core bumped from 2.0.4 to 2.0.5

## [2.1.2](https://github.com/judoscale/judoscale-node/compare/judoscale-bullmq-v2.1.1...judoscale-bullmq-v2.1.2) (2024-05-31)


### Bug Fixes

* Remove unnecessary logging ([ca7512d](https://github.com/judoscale/judoscale-node/commit/ca7512da96957586b1b09f3f29e9f0a25f980f84))

## [2.1.1](https://github.com/judoscale/judoscale-node/compare/judoscale-bullmq-v2.1.0...judoscale-bullmq-v2.1.1) (2024-05-31)


### Bug Fixes

* Add `redis_url` config option and fix the Redis connection ([#40](https://github.com/judoscale/judoscale-node/issues/40)) ([f03d0cf](https://github.com/judoscale/judoscale-node/commit/f03d0cfd3175f459cbe8ea6efea3daa1716e2b20))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * judoscale-node-core bumped from 2.0.3 to 2.0.4

## [2.1.0](https://github.com/judoscale/judoscale-node/compare/judoscale-bullmq-v2.0.3...judoscale-bullmq-v2.1.0) (2024-05-31)


### Features

* Add integration for autoscaling Bull job queue workers ([#37](https://github.com/judoscale/judoscale-node/issues/37)) ([5898502](https://github.com/judoscale/judoscale-node/commit/58985020319f8d747c5ec4ce5c21e388d666f5f6))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * judoscale-node-core bumped from 2.0.2 to 2.0.3

## [2.0.3](https://github.com/judoscale/judoscale-node/compare/judoscale-bullmq-v2.0.2...judoscale-bullmq-v2.0.3) (2024-05-30)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * judoscale-node-core bumped from 2.0.1 to 2.0.2

## [2.0.2](https://github.com/judoscale/judoscale-node/compare/judoscale-bullmq-v2.0.1...judoscale-bullmq-v2.0.2) (2024-05-30)


### Bug Fixes

* Fix internal dependencies on judoscale-node-core ([ad6bcb9](https://github.com/judoscale/judoscale-node/commit/ad6bcb94561d913b67a6b5e2ed68a1477b1abeec))

## [2.0.1](https://github.com/judoscale/judoscale-node/compare/judoscale-bullmq-v2.0.0...judoscale-bullmq-v2.0.1) (2024-05-29)

### Bug Fixes

* Gracefully handle missing queue time for fastify ([#31](https://github.com/judoscale/judoscale-node/issues/31)) ([8fa1dff](https://github.com/judoscale/judoscale-node/commit/8fa1dff430e7cffc1f6dd97242734864145cf648))

### Miscellaneous Chores

* release 2.0.1 ([b0b22bf](https://github.com/judoscale/judoscale-node/commit/b0b22bf8dd8662d7ee4d0450abdbbf7462200492))
* Reorganize monorepo to use npm workspaces ([77c8565](https://github.com/judoscale/judoscale-node/commit/77c856565ce13859df057b73aec6f45044e9ffa6))

## [2.0.0](https://github.com/judoscale/judoscale-node/compare/judoscale-bullmq-v1.3.0...judoscale-bullmq-v2.0.0) (2024-05-27)


### ⚠ BREAKING CHANGES

* Use a single reporter across adapters [NEW API] ([#27](https://github.com/judoscale/judoscale-node/issues/27))

### Features

* Use a single reporter across adapters [NEW API] ([#27](https://github.com/judoscale/judoscale-node/issues/27)) ([81e76d7](https://github.com/judoscale/judoscale-node/commit/81e76d7f81c89919045649dc4109574503955304))
* Add BullMQ integration ([#25](https://github.com/judoscale/judoscale-node/issues/25)) ([8690560](https://github.com/judoscale/judoscale-node/commit/869056045d12465d1e75ac7254f9b2b55be520d7))
