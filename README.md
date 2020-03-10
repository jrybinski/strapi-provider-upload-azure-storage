# Strapi Provider Upload Azure Storage

Plugin enabling image uploading to azure storage from strapi.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Node 10+
* npm 6+
* strapi@3.0.0-beta.16+

### Installing

Inside your strapi project run the following

```
yarn add strapi-provider-upload-azure-storage

# or

npm install strapi-provider-upload-azure-storage
```

Edit custom configuration in Strapi project 
`config/custom.json`

you need to add 
```
  "azure": {
    "accountName": "${process.env.AZURE_ACCOUNT_NAME}",
    "secretAccessKey": "${process.env.AZURE_SECRET_ACCESS_KEY}",
    "containerName": "${process.env.AZURE_CONTAINER_NAME}",
    "cdnEndpoint": "${process.env.AZURE_CDN_ENDPOINT}"
  }
```

## Contributing

Contributions are welcome

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/jakeFeldman/strapi-provider-upload-azure-storage/releases).

## Authors

* **Jakub Rybiński** - *Add image optimization and move configuration into ENVs* - [jrybinski](https://github.com/jrybinski)
* **Jake Feldman** - *Initial work* - [jakeFeldman](https://github.com/jakeFeldman)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* strapi.io
* Azure
