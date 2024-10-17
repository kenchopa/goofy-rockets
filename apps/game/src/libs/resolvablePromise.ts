/* eslint-disable import/prefer-default-export */
export class ResolvablePromise<TResolve = void> {
  public readonly promise: Promise<TResolve>;

  private _reject!: (reason?: unknown) => void;

  private _resolve!: (resData: TResolve) => void;

  constructor() {
    this.promise = new Promise<TResolve>((res, rej) => {
      this._reject = rej;
      this._resolve = res;
    });
  }

  public get reject(): (reason?: unknown) => void {
    return this._reject;
  }

  public get resolve(): (data: TResolve) => void {
    return this._resolve;
  }
}
