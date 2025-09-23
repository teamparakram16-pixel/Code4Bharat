export const parseZodError = (error) => {
  if (!error || !error.errors) return "Invalid input data";

  const messages = error.errors.map((err) => err.message).filter(Boolean);

  return messages.length ? messages.join("..."): "Invalid input data";
};
