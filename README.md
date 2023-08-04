# Epigos Node

![Tests](https://github.com/Epigos-Inc/epigos-ts/actions/workflows/tests.yaml/badge.svg)

Epigos provides an end-to-end platform to annotate data, train computer vision AI models,
deploy them seamlessly and host the models via APIs.

For more details, visit [epigos.ai](https://epigos.ai).

The Epigos Node Package is a node wrapper around the core Epigos AI web application and REST API.

## Installation

```bash
  npm install @epigos/epigos-sdk
  # or
  yarn add @epigos/epigos-sdk
```

## Gettting Started

To make your first API call, you will need to signup at [epigos.ai](https://epigos.ai) and create an
API key for your workspace. Please contact our sales team for a demo.

### Initialization:

```ts
import { Epigos } from '@epigos/epigos-sdk'

const epigos = Epigos({ apiKey: 'api_key_123' })
```

### Prediction:

Make predictions with any of the models deployed in your workspace using the `Model ID`.

#### Classification

```ts
import { Epigos } from '@epigos/epigos-sdk'

const epigos = Epigos({ apiKey: 'api_key_123' })

// load classification model
model = epigos.classification('modelId')

// make predictions
results = await model.predict({ imageUrl: 'path/to/your/image.jpg' })

console.log(results)
```

## Contributing

If you want to extend our Python library or if you find a bug, please open a PR!

Also be sure to test your code with the `npm` or `yarn` command at the root level directory.

Run tests:

```bash
npm test
# or
yarn test
```

### Commit message guidelines

It’s important to write sensible commit messages to help the team move faster.

Please follow the [commit guidelines](https://www.conventionalcommits.org/en/v1.0.0/)

### Versioning

This project uses [Semantic Versioning](https://semver.org/).

## Publishing

This project is published on NPM

## License

This library is released under the [MIT License](LICENSE).
