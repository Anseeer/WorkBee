
export class successResponse<T> {
  constructor(public status: number, public message: string, public data: T) {

  }
}

export class errorResponse<T> extends Error {
  status: number;
  data: T;

  constructor(status: number, message: string, data: T) {
    super(message);
    this.status = status;
    this.data = data;
  }
}
