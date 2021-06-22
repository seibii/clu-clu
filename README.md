# clu-clu
cycle.js utilities

[![CircleCI](https://circleci.com/gh/seibii/clu-clu.svg?style=svg)](https://circleci.com/gh/seibii/clu-clu)

## Requirements
- Node 15.4.0
- yarn

```bash
brew install nodebrew yarn
nodebrew install-binary 15.4.0
nodebrew use 15.4.0
```

## Develop

#### Run lint
```bash
docker compose exec web yarn lint
docker compose exec web yarn lint:fix
```

#### Run tests and eslint automatically

```bash
docker compose exec web yarn watch
``
