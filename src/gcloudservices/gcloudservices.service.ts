import { Injectable } from '@nestjs/common';
import { Bucket, Storage } from '@google-cloud/storage';
import { parse } from 'path';
@Injectable()
export class GcloudservicesService {
    private bucket : Bucket;
    private storage: Storage;
    constructor() {
        this.storage = new Storage()
        this.bucket = this.storage.bucket('exping-349607.appspot.com')
    }
}
