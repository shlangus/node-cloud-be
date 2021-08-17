export class S3 {
  getSignedUrlPromise;

  static mockGetSignedUrlPromise(fn) {
    this.prototype.getSignedUrlPromise = fn;
  }
}
