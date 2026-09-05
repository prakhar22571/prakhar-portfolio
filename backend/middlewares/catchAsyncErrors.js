export const catchAsyncErrors = (theFunction) => {
  return (req, res, next) => {
    return Promise.resolve()
      .then(() => theFunction(req, res, next))
      .catch(next);
  };
};
