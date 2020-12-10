import * as awsv4 from 'aws4';
import axios from 'axios';

const host = process.env.CS_HOST || '';
const accessKeyId = process.env.CS_API_KEY_ID || '';
const secretAccessKey = process.env.CS_API_SECRET_KEY || '';
const bucketName = process.env.CS_BUCKET || '';

export function chFullReq(host: string, accessKeyId: string, secretAccessKey: string, bucketName: string) {

    const reqOpts = awsv4.sign({
        host: host,
        service: 's3',
        region: 'us-east-1',
    }, {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    });

    console.log(reqOpts);

    const resp = axios.request({
        url: `https://${host}/Bucket/metadata`,
        method: 'POST',
        headers: reqOpts.headers,
        data: {
            BucketName: bucketName
        }
    });

    resp.then((res) => {
        console.log(res);
    }).catch((err) => {
        console.error(err);
    })
}

chFullReq(host, accessKeyId, secretAccessKey, bucketName);
