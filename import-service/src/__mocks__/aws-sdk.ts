export class S3 {
  getSignedUrlPromise;

  static mockGetSignedUrlPromise(fn) {
    this.prototype.getSignedUrlPromise = fn;
  }
}

export class Lambda {
  invoke(...args) {
    return {
      promise: async () => this._invoke(...args)
    }
  };

  _invoke;

  static mockInvoke(fn) {
    this.prototype._invoke = fn;
  }
}

export class SNS {
  publish(...args) {
    return {
      promise: async () => this._publish(...args)
    }
  };

  _publish;

  static mockPublish(fn) {
    this.prototype._publish = fn;
  }
}

export class SQS {
  deleteMessage(...args) {
    return {
      promise: async () => this._deleteMessage(...args)
    }
  };

  _deleteMessage;

  static mockDeleteMessage(fn) {
    this.prototype._deleteMessage = fn;
  }
}
