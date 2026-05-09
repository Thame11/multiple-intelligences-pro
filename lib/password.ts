import crypto from "crypto";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const iterations = 210_000;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex");
  return `${iterations}:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [iterationsText, salt, hash] = stored.split(":");
  const iterations = Number(iterationsText);
  if (!iterations || !salt || !hash) return false;
  const candidate = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex");
  const candidateBuffer = Buffer.from(candidate, "hex");
  const hashBuffer = Buffer.from(hash, "hex");
  if (candidateBuffer.length !== hashBuffer.length) return false;
  return crypto.timingSafeEqual(candidateBuffer, hashBuffer);
}
