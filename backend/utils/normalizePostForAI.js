export function normalizePostForAI(doc, type) {
  return {
    postId: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    routines: doc.routines || [],
    filters: doc.filters || [],
    type,
  };
}
