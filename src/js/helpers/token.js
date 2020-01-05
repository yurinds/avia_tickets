export function createUniqueToken() {
  const token =
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2);

  return token;
}
