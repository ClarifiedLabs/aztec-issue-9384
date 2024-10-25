Reproduction of issue [https://github.com/AztecProtocol/aztec-packages/issues/9384](https://github.com/AztecProtocol/aztec-packages/issues/9384).

## Install/Build

```
npm install
make
```

## Run

If running from the devcontainer:
```
docker-compose up -d
# wait a bit for the sandbox to start
npm run example
```

If running locally:
```
VERSION=0.60.0 aztec-up
aztec start --sandbox
npm run example
```
