# jupyterlab_gist

A Jupyterlab extension to post notebook to gist.

![](./screenshot.png)

The gist url is displayed in the browser console. I am currently looking a better way to display it to the user.

## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install @hadim/jupyterlab_gist
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
yarn install
yarn build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
yarn watch
jupyter lab --watch
```

To release a new version:

```bash
yarn publish
```

## Authors

`jupyterlab_gist` has been created by [Hadrien Mary](mailto:hadrien.mary@gmail.com).

## License

MIT. See [LICENSE](LICENSE)