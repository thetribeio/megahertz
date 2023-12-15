# MegaHertz backend

This project is the backend for MegaHertz, a car rental software.
This project is the support project for software architecture courses from theTribe.

## License

The project is available under the Aladdin Free Public License which is available [here](LICENSE.md).

## Known issues

### Jest performances

As discussed [here](https://github.com/kulshekhar/ts-jest/issues/259), Jest tests are slow to start with TypeScript.
A workaround to "isolate the modules" reduces the launch time but does not validate typing anymore.
Since type validation is essential, especially in TDD, the mentioned workaround has not been implemented, hence slow
tests at launch.

## Installation and setup for the course

### Requirements

- nvm
- git
- docker
- docker-compose

### Instructions

If you haven't already, please fork and sync this project.
You can learn how to fork and sync [here](https://docs.github.com/en/get-started/quickstart/fork-a-repo).

Once you have cloned your fork, please cd to the project's root and run the commands below.

```shell
# If node v20.x is not installed
nvm install v20
nvm use v20
yarn install
```

To launch integration and e2e tests, you will need a running container of postgres:

```shell
docker-compose up -d
```

### Troubleshoot

Please reach out to harold.cohen@thetribe.io if you encounter any troubleshoot during installation.

