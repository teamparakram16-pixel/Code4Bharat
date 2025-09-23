const calculateReadTime = (data) => {
  let textParts = [];

  if (data.title) textParts.push(data.title);
  if (data.description) textParts.push(data.description);
  if (data.routines && data.routines.length > 0) {
    const routineText = data.routines
      .map((r) => `${r.time} ${r.content}`)
      .join(" ");
    textParts.push(routineText);
  }

  const fullText = textParts.join(" ");
  const wordCount = fullText.trim().split(/\s+/).length;

  const wordsPerMinute = 200;
  return String(Math.ceil(wordCount / wordsPerMinute) + "min");
};

export default calculateReadTime;
