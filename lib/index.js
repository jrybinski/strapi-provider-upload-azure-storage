const {
    Aborter,
    BlobURL,
    BlockBlobURL,
    ContainerURL,
    ServiceURL,
    StorageURL,
    SharedKeyCredential,
    uploadStreamToBlockBlob,
} = require('@azure/storage-blob');
const BufferStream = require('./BufferStream');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const trimParam = str => (typeof str === 'string' ? str.trim() : undefined);

module.exports = {
    provider: 'azureWithEnvsAndImagemin',
    auth: {
        maxConcurent: {
            label: 'The maximum concurrent uploads to Azure',
            type: 'number'
        },
    },
    init: config => {
        const account = trimParam((strapi.config.azure.accountName));
        const accountKey = trimParam((strapi.config.azure.secretAccessKey));
        const containerName = trimParam((strapi.config.azure.containerName));
        const defaultPath = trimParam((strapi.config.azure.cdnEndpoint));
        const sharedKeyCredential = new SharedKeyCredential(account, accountKey);
        const pipeline = StorageURL.newPipeline(sharedKeyCredential);
        const serviceURL = new ServiceURL(`https://${account}.blob.core.windows.net`, pipeline);
        const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);

        return {
            upload: file => new Promise((resolve, reject) => {
                const fileName = file.hash + file.ext;
                const containerWithPath = Object.assign({}, containerURL);
                containerWithPath.url += file.path ? `/${file.path}` : `/${defaultPath}`;

                const blobURL = BlobURL.fromContainerURL(containerWithPath, fileName);
                const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);

                file.url = blobURL.url;

                imagemin.buffer(file.buffer, {
                    plugins: [
                        imageminJpegtran(),
                        imageminPngquant({quality: '80'})
                    ]
                }).then(function (minifiedBuffer) {
                    return uploadStreamToBlockBlob(
                        Aborter.timeout(60 * 60 * 1000),
                        new BufferStream(minifiedBuffer), blockBlobURL,
                        4 * 1024 * 1024,
                        ~~(config.maxConcurent) || 20,
                        {
                            blobHTTPHeaders: {
                                blobContentType: file.mime
                            }
                        }
                    ).then(resolve, reject);
                }, reject);
            }),
            delete: file => new Promise((resolve, reject) => {
                const _temp = file.url.replace(containerURL.url, '');
                const pathParts = _temp.split('/').filter(x => x.length > 0);
                const fileName = pathParts.splice(pathParts.length - 1, 1);
                const containerWithPath = containerURL;
                containerWithPath.url += '/' + pathParts.join('/');

                const blobURL = BlobURL.fromContainerURL(containerWithPath, fileName);
                const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);

                return blockBlobURL.delete().then(resolve, err => reject(err));
            }),
        };
    }
};
