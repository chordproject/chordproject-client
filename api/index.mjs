export default async (req, res) => {
  const { reqHandler } = await import('../dist/fuse/server/server.mjs');
  return reqHandler(req, res);
};
