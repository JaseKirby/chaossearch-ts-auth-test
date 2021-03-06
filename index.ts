import * as aws4 from 'aws4';
import axios from 'axios';

const host = process.env.CS_HOST || '';
const accessKeyId = process.env.CS_API_KEY_ID || '';
const secretAccessKey = process.env.CS_API_SECRET_KEY || '';
const bucketName = process.env.CS_BUCKET || '';

csV1(host, accessKeyId, secretAccessKey).then(() => {
    console.log('=====================csV1-end=============================\n\n\n');
});

csBucketMetadata(host, accessKeyId, secretAccessKey, bucketName).then(() => {
    console.log('=====================csBucketMetadata-end=================\n\n\n');
});


csObjGroup(host, accessKeyId, secretAccessKey, bucketName).then(() => {
    console.log('=====================csObjGroup-end=======================\n\n\n');
});

export async function csV1(host: string, accessKeyId: string, secretAccessKey: string) {
    const reqOpts = aws4.sign({
        host: host,
        service: 's3',
        region: 'us-east-1',
        path: '/V1/'
    }, {
        secretAccessKey: secretAccessKey,
        accessKeyId: accessKeyId
    });

    console.log(reqOpts);

    const resp = await axios.request({
        url: `https://${host}/V1/`,
        method: 'GET',
        headers: reqOpts.headers
    }).catch((err) => {
        console.error(err);
    });

    console.log(resp);
}

export async function csBucketMetadata(host: string, accessKeyId: string, secretAccessKey: string, bucketName: string) {
    const reqOpts = aws4.sign({
        host: host,
        service: 's3',
        region: 'us-east-1',
        method: 'POST',
        path: '/Bucket/metadata/'
    }, {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    });

    console.log(reqOpts);

    const resp = await axios.request({
        url: `https://${host}/Bucket/metadata/`,
        method: 'POST',
        headers: reqOpts.headers,
        data: {
            BucketName: bucketName
        }
    }).catch((err) => {
        console.error(err);
    });;

    console.log(resp);
}

export async function csObjGroup(host: string, accessKeyId: string, secretAccessKey: string, bucketName: string) {
    const csObjGroup = {
        bucket: `${bucketName}-int-test`,
        source: bucketName,
        indexRetention: 14,
        format: {
            _type: 'JSON',
            stripPrefix: true,
            horizontal: true
        },
        filter: { "AND": [{ "field": "key", "prefix": "ecs/" }, { "field": "key", "regex": ".*" }] },
        options: {
            ignoreIrregular: true,
            compression: 'GZIP'
        }
    };

    const reqOpts = aws4.sign({
        host: host,
        service: 's3',
        region: 'us-east-1',
        method: 'POST',
        path: '/Bucket/createObjectGroup/'
    }, {
        secretAccessKey: secretAccessKey,
        accessKeyId: accessKeyId
    });

    console.log(reqOpts);

    const resp = await axios.request({
        url: `https://${host}/Bucket/createObjectGroup/`,
        method: 'POST',
        headers: reqOpts.headers,
        data: csObjGroup
    }).catch((err) => {
        console.error(err);
    });;

    console.log(resp);
}
