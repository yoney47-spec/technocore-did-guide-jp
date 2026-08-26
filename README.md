# Technocore DID Guide JP

Technocoreの公式仕様とコミュニティ上の推測を分離し、公開Ed25519 DIDの形式確認と公開証拠文の作成を行う、依存ライブラリなしの静的サイトです。

## セキュリティ方針

- 入力対象は公開情報である `did:key:z6Mk…`、room、sequenceだけです。
- 秘密鍵、seed、`identity.pem`、ウォレットのリカバリーフレーズを処理しません。
- `fetch`、XHR、WebSocket、フォーム送信、Cookie、localStorage、sessionStorageを使用しません。
- Content Security Policyで外部通信を `connect-src 'none'` にしています。
- DID検証とSHA-256 fingerprint計算は、ブラウザ標準機能だけで端末内処理します。

## GitHub Pagesで公開する

1. GitHubで新しいPublicリポジトリを作成します。
2. このフォルダの全ファイルをリポジトリ直下へアップロードします。
3. リポジトリの **Settings → Pages** を開きます。
4. **Build and deployment** のSourceを **Deploy from a branch** にします。
5. Branchを **main**、フォルダを **/(root)** にして **Save** を押します。
6. 表示された `https://ユーザー名.github.io/リポジトリ名/` を公開成果物URLとして使います。

GitHubへのアップロード前に、`SECURITY_AUDIT.md`とソース全文を確認してください。
画面ごとの詳しい操作と、公式署名コードを安全に使う手順は `USER_STEPS_JA.md` にあります。

## 公式資料

- FLOP Labs公式投稿: https://x.com/flop_labs/status/2091830155270672521
- Technocore認証仕様: https://technocore.chat/auth.md
- Technocore公式ソース: https://github.com/flop-labs/technocore-chat

## 免責

FLOP Labs非公式です。エアドロの資格・配分・受領を保証しません。
