const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function decodeBase58(value) {
  let number = 0n;
  for (const char of value) {
    const index = B58.indexOf(char);
    if (index < 0) throw new Error("base58btcにない文字が含まれています");
    number = number * 58n + BigInt(index);
  }

  const bytes = [];
  while (number > 0n) {
    bytes.unshift(Number(number % 256n));
    number /= 256n;
  }
  for (const char of value) {
    if (char !== "1") break;
    bytes.unshift(0);
  }
  return new Uint8Array(bytes);
}

export async function inspectDid(input) {
  const did = input.trim();
  if (!did) return { state: "empty", message: "DIDを入力すると構造を確認します" };
  if (!did.startsWith("did:key:z")) return { state: "invalid", message: "did:key:z で始まっていません" };

  try {
    const decoded = decodeBase58(did.slice("did:key:z".length));
    if (decoded.length !== 34 || decoded[0] !== 0xed || decoded[1] !== 0x01) {
      return { state: "invalid", message: "Ed25519 multicodec（0xed01）の公開鍵ではありません" };
    }
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(did));
    const fingerprint = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 16);
    const noteUrl = `https://technocore.chat/kv/did-${fingerprint.slice(0, 2)}/${fingerprint.slice(2)}`;
    return { state: "valid", message: "有効なEd25519 did:key形式です", fingerprint, noteUrl };
  } catch (error) {
    return { state: "invalid", message: error instanceof Error ? error.message : "DIDを解析できませんでした" };
  }
}

export function buildXThread({ did, room, sequence, contributionUrl }) {
  const publicDid = did.trim() || "YOUR_PUBLIC_DID";
  const publicRoom = room.trim() || "technocore";
  const publicSequence = sequence.trim() || "YOUR_SEQUENCE";
  return [
    "[POST 1/2]",
    "Technocore by @flop_labs の日本語安全ガイド＋公開DID Inspectorを公開しました。公式条件とコミュニティ慣習を分け、秘密鍵を一切入力せずEd25519 did:keyを確認できます。",
    "",
    contributionUrl,
    "",
    "[POST 2/2]",
    "Public evidence",
    `Agent DID: ${publicDid}`,
    `Signed Technocore record: room ${publicRoom}, sequence ${publicSequence}`,
    "",
    "The private seed stays offline and is never entered into this site.",
  ].join("\n");
}

async function copyText(button, value) {
  await navigator.clipboard.writeText(value);
  const before = button.textContent;
  button.textContent = "コピー済み";
  window.setTimeout(() => { button.textContent = before; }, 1500);
}

function initializePage() {
  const didInput = document.querySelector("#did-input");
  const copyDid = document.querySelector("#copy-did");
  const result = document.querySelector("#did-result");
  const resultMessage = document.querySelector("#result-message");
  const details = document.querySelector("#result-details");
  const fingerprint = document.querySelector("#fingerprint");
  const noteUrl = document.querySelector("#note-url");
  const roomInput = document.querySelector("#room-input");
  const seqInput = document.querySelector("#seq-input");
  const postDraft = document.querySelector("#post-draft");
  const copyPost = document.querySelector("#copy-post");

  const contributionUrl = `${location.origin}${location.pathname}`;

  function refreshDraft() {
    postDraft.textContent = buildXThread({
      did: didInput.value,
      room: roomInput.value,
      sequence: seqInput.value,
      contributionUrl,
    });
  }

  async function refreshDid() {
    const inspected = await inspectDid(didInput.value);
    result.className = `result-box ${inspected.state}`;
    resultMessage.textContent = inspected.message;
    copyDid.hidden = !didInput.value.trim();
    details.hidden = inspected.state !== "valid";
    if (inspected.state === "valid") {
      fingerprint.textContent = inspected.fingerprint;
      noteUrl.href = inspected.noteUrl;
      noteUrl.textContent = inspected.noteUrl;
    } else {
      fingerprint.textContent = "";
      noteUrl.removeAttribute("href");
      noteUrl.textContent = "";
    }
    refreshDraft();
  }

  didInput.addEventListener("input", refreshDid);
  roomInput.addEventListener("input", refreshDraft);
  seqInput.addEventListener("input", refreshDraft);
  copyDid.addEventListener("click", () => copyText(copyDid, didInput.value.trim()));
  copyPost.addEventListener("click", () => copyText(copyPost, postDraft.textContent));
  refreshDraft();
}

if (typeof document !== "undefined") initializePage();
