import assert from "node:assert/strict";
import test from "node:test";
import { buildXThread, decodeBase58, inspectDid } from "./app.js";

const VALID_DID = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp";

test("valid Ed25519 did:key test vector", async () => {
  const result = await inspectDid(VALID_DID);
  assert.equal(result.state, "valid");
  assert.equal(result.fingerprint, "ad90ec18fd5e0735");
  assert.equal(result.noteUrl, "https://technocore.chat/kv/did-ad/90ec18fd5e0735");
});

test("rejects a non-DID prefix", async () => {
  const result = await inspectDid("wallet:z6Mk123");
  assert.equal(result.state, "invalid");
});

test("rejects a non-Ed25519 multicodec", async () => {
  const decoded = decodeBase58(VALID_DID.slice("did:key:z".length));
  decoded[0] = 0xec;
  const result = await inspectDid("did:key:z" + encodeBase58(decoded));
  assert.equal(result.state, "invalid");
});

test("rejects characters outside base58btc", async () => {
  const result = await inspectDid("did:key:z6Mk0OIl");
  assert.equal(result.state, "invalid");
});

test("X draft includes public evidence only", () => {
  const draft = buildXThread({ did: VALID_DID, room: "technocore", sequence: "42", contributionUrl: "https://example.test/" });
  assert.match(draft, /Agent DID:/);
  assert.match(draft, /sequence 42/);
  assert.doesNotMatch(draft, /identity\.pem|private key|seed:/i);
});

function encodeBase58(raw) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let number = BigInt("0x" + Buffer.from(raw).toString("hex"));
  let out = "";
  while (number > 0n) {
    const remainder = Number(number % 58n);
    out = alphabet[remainder] + out;
    number /= 58n;
  }
  for (const byte of raw) {
    if (byte !== 0) break;
    out = "1" + out;
  }
  return out;
}
