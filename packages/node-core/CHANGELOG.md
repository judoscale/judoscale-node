# Changelog

## [2.1.0](https://github.com/judoscale/judoscale-node/compare/judoscale-node-core-v2.0.7...judoscale-node-core-v2.1.0) (2025-01-15)


### Features

* Configure runtime container for Railway ([#54](https://github.com/judoscale/judoscale-node/issues/54)) ([8ca929d](https://github.com/judoscale/judoscale-node/commit/8ca929d68a460fd6123e62e5f341cea0f2d9c900))

## [2.0.7](https://github.com/judoscale/judoscale-node/compare/judoscale-node-core-v2.0.6...judoscale-node-core-v2.0.7) (2024-12-31)


### Bug Fixes

* JUDOSCALE_URL should take priority over RENDER_SERVICE_ID on Render ([4dffebf](https://github.com/judoscale/judoscale-node/commit/4dffebfab61857400b482f5d8fca7177cc233838))

## [2.0.6](https://github.com/judoscale/judoscale-node/compare/judoscale-node-core-v2.0.5...judoscale-node-core-v2.0.6) (2024-06-06)


### Bug Fixes

* Don't include the entire config object in reports ([#47](https://github.com/judoscale/judoscale-node/issues/47)) ([d51426c](https://github.com/judoscale/judoscale-node/commit/d51426cf581aecf80c51c23737c8b106a1aaea93))

## [2.0.5](https://github.com/judoscale/judoscale-node/compare/judoscale-node-core-v2.0.4...judoscale-node-core-v2.0.5) (2024-06-04)


### Bug Fixes

* Add `redis` config option for Bull & BullMQ ([#43](https://github.com/judoscale/judoscale-node/issues/43)) ([bb57dbd](https://github.com/judoscale/judoscale-node/commit/bb57dbd93cce930af872112a4a00c468d28fbc33))

## [2.0.4](https://github.com/judoscale/judoscale-node/compare/judoscale-node-core-v2.0.3...judoscale-node-core-v2.0.4) (2024-05-31)


### Bug Fixes

* Add `redis_url` config option and fix the Redis connection ([#40](https://github.com/judoscale/judoscale-node/issues/40)) ([f03d0cf](https://github.com/judoscale/judoscale-node/commit/f03d0cfd3175f459cbe8ea6efea3daa1716e2b20))

## [2.0.3](https://github.com/judoscale/judoscale-node/compare/judoscale-node-core-v2.0.2...judoscale-node-core-v2.0.3) (2024-05-31)


### Bug Fixes

* Clean up configuration code ([#39](https://github.com/judoscale/judoscale-node/issues/39)) ([cd426be](https://github.com/judoscale/judoscale-node/commit/cd426be85aef07875b96a7e22c276b5b84ed4d7b))

## [2.0.2](https://github.com/judoscale/judoscale-node/compare/judoscale-node-core-v2.0.1...judoscale-node-core-v2.0.2) (2024-05-30)


### Bug Fixes

* Testing release-please updating dependencies ([fce11db](https://github.com/judoscale/judoscale-node/commit/fce11db52ada8d4479af4068a6b59e1f353fb312))

## [2.0.1](https://github.com/judoscale/judoscale-node/compare/judoscale-node-core-v2.0.0...judoscale-node-core-v2.0.1) (2024-05-29)


### Bug Fixes

* Gracefully handle missing queue time for fastify ([#31](https://github.com/judoscale/judoscale-node/issues/31)) ([8fa1dff](https://github.com/judoscale/judoscale-node/commit/8fa1dff430e7cffc1f6dd97242734864145cf648))

### Miscellaneous Chores

* release 2.0.1 ([b0b22bf](https://github.com/judoscale/judoscale-node/commit/b0b22bf8dd8662d7ee4d0450abdbbf7462200492))
* Reorganize monorepo to use npm workspaces ([77c8565](https://github.com/judoscale/judoscale-node/commit/77c856565ce13859df057b73aec6f45044e9ffa6))

## [2.0.0](https://github.com/judoscale/judoscale-node/compare/judoscale-node-core-v1.3.0...judoscale-node-core-v2.0.0) (2024-05-27)


### ⚠ BREAKING CHANGES

* Use a single reporter across adapters [NEW API] ([#27](https://github.com/judoscale/judoscale-node/issues/27))

### Features

* Use a single reporter across adapters [NEW API] ([#27](https://github.com/judoscale/judoscale-node/issues/27)) ([81e76d7](https://github.com/judoscale/judoscale-node/commit/81e76d7f81c89919045649dc4109574503955304))
* Add BullMQ integration ([#25](https://github.com/judoscale/judoscale-node/issues/25)) ([8690560](https://github.com/judoscale/judoscale-node/commit/869056045d12465d1e75ac7254f9b2b55be520d7))
