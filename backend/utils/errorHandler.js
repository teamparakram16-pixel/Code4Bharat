const errorHandler = (err, req, res, next) => {
  if (err) {
    const statusNumber = err.status || 500;
    const Msg = err.errMsg || "Internal server error";
    console.log(err);
    console.log(`${statusNumber} , ${Msg}`);
    res.status(statusNumber).json({
      success: false,
      status: statusNumber,
      message: Msg,
    });
  } else {
    next();
  }
};

export default errorHandler;
