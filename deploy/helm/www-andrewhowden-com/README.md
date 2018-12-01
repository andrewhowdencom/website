# __web__

## Installation

```
    # Todo: Document any required values, if they exist.
    $ helm upgrade --install path/to/web web
```

## Configuration

All configuration values are documented in values.yaml. Check that for references, default values etc. To modify a
configuration value for a chart, you can either supply your own values.yaml overriding the default one in the repo:

```bash
$ helm upgrade --install path/to/web web --values path/to/custom/values/file.yaml
```

Or, you can override an individual configuration setting with `helm upgrade --set`

```bash
$ helm upgrade --install path/to/web web --set pod.nginx.image="your/image:1.0.0"

## Usage

// Todo: Write up usage.
