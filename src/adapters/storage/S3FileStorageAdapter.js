// adapters/storage/S3FileStorageAdapter.js
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { IFileStorageAdapter } from './IFileStorageAdapter';

export class S3FileStorageAdapter extends IFileStorageAdapter {
  constructor(bucketName) {
    super();
    this.s3 = new S3Client();
    this.bucket = bucketName;
  }

  async readFile(path) {
    const response = await this.s3.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: path })
    );
    return response.Body.transformToByteArray();
  }
  // ...implement other methods
}