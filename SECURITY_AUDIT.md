# Security audit

監査日: 2026-08-26

## 対象

- `index.html`
- `styles.css`
- `app.js`
- `README.md`

## データフロー

| 入力 | 用途 | 外部送信 | 保存 |
|---|---|---:|---:|
| 公開DID | Ed25519 multicodec確認、fingerprint計算 | なし | なし |
| room | X投稿下書き | なし | なし |
| sequence | X投稿下書き | なし | なし |

## 確認結果

- 秘密鍵生成・署名・復号処理: なし
- ウォレット接続: なし
- `fetch` / XHR / WebSocket / Beacon: なし
- Cookie / localStorage / sessionStorage / IndexedDB: なし
- 外部JavaScript / CDN /解析タグ: なし
- `eval` / `new Function` / 動的HTML挿入: なし
- ユーザー入力のDOM反映: `textContent`とフォーム値のみ
- クリップボード: ユーザーが押したコピーボタンによる書き込みのみ
- 外部リンク: FLOP Labs X、Technocore公式仕様、公式GitHubのみ。新規タブには `noopener noreferrer` を指定
- CSP: `connect-src 'none'`、`script-src 'self'`、`object-src 'none'`、`form-action 'none'`

## 暗号処理

- 公開DIDのbase58btcを復号
- multicodec先頭2バイトがEd25519公開鍵を示す `0xed 0x01` か確認
- 公開DID文字列のSHA-256先頭16桁からTechnocoreのDID note conventionを計算
- 秘密鍵は使わない

## 既知の限界

- 形式確認はDID所有者の身元、誠実性、エアドロ資格を証明しません。
- GitHub Pagesは静的ホスティングです。公開後にリポジトリへ入った変更は、利用者自身が差分確認する必要があります。
- `frame-ancestors`はHTML内meta CSPでは強制できないため、本サイトはそれを安全性の前提にしていません。
- クリップボードAPIはHTTPS環境を前提とします。失敗した場合は手動コピーが必要です。

## テストベクトル

Ed25519 seedが32バイトのゼロである公開テストベクトルから算出した値です。秘密情報として使用してはいけません。

- DID: `did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp`
- fingerprint: `ad90ec18fd5e0735`
- expected note path: `https://technocore.chat/kv/did-ad/90ec18fd5e0735`

自動テストは、有効ベクトル、誤ったprefix、Ed25519以外のmulticodec、不正base58文字を確認します。
