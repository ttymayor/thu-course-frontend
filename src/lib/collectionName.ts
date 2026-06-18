export function getCollectionName(baseName: string) {
  return process.env.DB_ENV === "dev" ? `${baseName}_dev` : baseName;
}
