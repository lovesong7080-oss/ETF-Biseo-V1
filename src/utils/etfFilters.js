export function filterEtfsByName(etfDb, search) {
  const keyword = search.trim().toLowerCase();

  if (!keyword) {
    return etfDb;
  }

  return etfDb.filter(etf =>
    etf.name.toLowerCase().includes(keyword)
  );
}