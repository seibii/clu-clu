# cyclejs-helpers
cycle.js utilities


## Requirements
- Node 15.4.0
- direnv
- yarn

```bash
brew install nodebrew direnv yarn
brew install --cask docker
nodebrew install-binary 15.4.0
nodebrew use 15.4.0
```

## Setup
```bash
git clone git@github.com:seibii/seibii-frontend-customer.git
cd seibii-frontend-customer
cp .envrc.sample .envrc
vim .envrc # Set environmental variables properly

docker compose up -d
```

## Develop

#### Run server
```bash
docker compose exec web yarn start
open http://localhost:9000
```

#### Run lint
```bash
docker compose exec web yarn lint
docker compose exec web yarn lint:fix
```

#### Run tests and eslint automatically

```bash
docker compose exec web yarn watch
```

## Ref
- [10. プロダクト/HowTo](https://seibii.esa.io/#path=%2F10.%20%E3%83%97%E3%83%AD%E3%83%80%E3%82%AF%E3%83%88%2FHowTo)
