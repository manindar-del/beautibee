import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(process.env.NEXT_APP_CRYPTO_KEY, "salt", 24);

export function encryptData(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(data, "utf8", "hex");
  const encryptDataFinal = [
    encrypted + cipher.final("hex"),
    Buffer.from(iv).toString("hex"),
  ].join("|");
  return encryptDataFinal;
}

export function decryptData(data) {
  const [encrypted, iv] = data.split("|");
  if (!iv) throw new Error("IV not found");
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );
  const _decryptedDataFinal= decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");

  return _decryptedDataFinal;
}
