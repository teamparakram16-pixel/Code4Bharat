class ExpressError extends Error {
  status;
  errMsg;
  constructor(status, errMsg) {
    super();
    this.status = status;
    this.errMsg = errMsg;
  }
}

export default ExpressError;
