export default class HttpError extends Error {
  constructor(args) {
    super(args.message);

    this.name = args.name || "Error";
    this.status = args.status;
  }
}
