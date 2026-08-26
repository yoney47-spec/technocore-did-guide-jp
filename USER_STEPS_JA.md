# ユーザーが手動で行う作業

この手順は、ChatGPT・公開Webサイト・GitHubへ秘密鍵を渡さないことを最優先にしています。

## 最初に理解しておくこと

- Web検証ツールへ入力するのは公開DID `did:key:z6Mk…` だけです。
- TechnocoreのDIDはウォレットアドレスではありません。
- 署名付きチェックインには、FLOP専用のEd25519秘密鍵がローカルPC内で必要です。
- 既存ウォレットの秘密鍵・シードフレーズ・リカバリーフレーズは一切使いません。
- リスクを完全にゼロにはできません。外部サービスにはIPアドレス、時刻、公開DID、署名、nonce、公開文面が伝わります。
- 不安がある場合は署名作業へ進まず、公開ガイドだけを利用してください。

---

## A. GitHub Pagesでソースを公開する

### A-1. ZIPを展開

`Technocore-DID-Guide-JP-GitHub-Pages.zip`を右クリックし、**すべて展開**を選びます。

展開後、次のファイルだけがあることを確認します。

- `index.html`
- `styles.css`
- `app.js`
- `README.md`
- `SECURITY_AUDIT.md`
- `CHECKSUMS.txt`
- `LICENSE`
- `app.test.mjs`
- `USER_STEPS_JA.md`

`identity.pem`、`.env`、秘密鍵、seedを書いたファイルが入っていたらアップロードしないでください。正規の配布ZIPには入っていません。

### A-2. Publicリポジトリを作成

1. GitHubへログインします。
2. 右上の **＋** → **New repository** を押します。
3. Repository nameを `technocore-did-guide-jp` にします。
4. **Public** を選びます。
5. README、`.gitignore`、Licenseの自動追加はすべて選ばず、**Create repository** を押します。

注意：PublicリポジトリではGitHubユーザー名と更新履歴が公開されます。

### A-3. ファイルをアップロード

1. 作成した空のリポジトリで **uploading an existing file** を押します。
2. 展開した9ファイルをまとめてドラッグします。
3. 画面のファイル一覧に秘密情報がないことをもう一度確認します。
4. Commit messageを `Publish Technocore DID safety guide` にします。
5. **Commit changes** を押します。

### A-4. GitHub Pagesを有効化

1. リポジトリ上部の **Settings** を押します。
2. 左側の **Pages** を押します。
3. **Build and deployment** → Sourceを **Deploy from a branch** にします。
4. Branchを **main**、フォルダを **/(root)** にします。
5. **Save** を押します。
6. 数分後に表示される `https://ユーザー名.github.io/technocore-did-guide-jp/` を開きます。

### A-5. 公開後の確認

1. DID入力欄に、秘密鍵ではなく公開テストDIDを貼ります。
2. 「有効なEd25519 did:key形式です」と表示されることを確認します。

公開テストDID：

`did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp`

この値はテスト専用であり、自分のDIDとして使ってはいけません。

---

## B. FLOP Labs公式署名コードを確認する

以下はGitHub Pagesの公開URLができた後に行います。独自の実行ファイルは使いません。

2026-08-26時点で監査した公式Technocoreリポジトリのコミット：

`fe506239aa85f6caadf31b88ed7d4d5f805ef6e3`

監査対象 `scripts/sign.py` のSHA-256：

`667e3d6cf48301d1b43f44c9b328d73ec1dbf413ddc89fcb740baf86f6406c15`

### B-1. 前提

- Windows 10または11
- Python 3.12以降
- パスワードマネージャーなど、専用seedを安全に保管できる場所
- 画面共有・録画・クリップボード同期を停止した状態

保管場所を準備できない場合は、ここで止めてください。

### B-2. 公式ソースを固定コミットから取得

PowerShellを開き、次を1行ずつ実行します。

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\TechnocoreAgent"
Set-Location "$env:USERPROFILE\TechnocoreAgent"
Invoke-WebRequest "https://raw.githubusercontent.com/flop-labs/technocore-chat/fe506239aa85f6caadf31b88ed7d4d5f805ef6e3/scripts/sign.py" -OutFile ".\sign.py"
(Get-FileHash ".\sign.py" -Algorithm SHA256).Hash
```

最後に表示された値が次と完全一致することを確認します。

`667E3D6CF48301D1B43F44C9B328D73EC1DBF413DDC89FCB740BAF86F6406C15`

一致しなければ、そのファイルを実行せず終了してください。

ソース全文は次で開けます。

```powershell
notepad ".\sign.py"
```

### B-3. 分離環境を作る

```powershell
py -3.12 -m venv ".venv"
& ".\.venv\Scripts\python.exe" -m pip install "cryptography==46.0.0"
```

この操作はPythonの暗号ライブラリを専用フォルダ内へ導入します。他のPython環境やウォレットには触れません。

---

## C. FLOP専用DIDを生成する

### C-1. 新規生成

次を実行します。

```powershell
& ".\.venv\Scripts\python.exe" ".\sign.py" keygen
```

画面に次の2行が表示されます。

- `seed:` 64桁の秘密情報
- `did:` `did:key:z6Mk…` で始まる公開情報

### C-2. 保存方法

1. `seed:`の64桁だけをパスワードマネージャーの新規Secure Noteへ保存します。
2. 項目名を「Technocore FLOP専用Ed25519 seed」とします。
3. `did:`は公開情報として別途メモできます。
4. seedをテキストファイル、スクリーンショット、メール、ChatGPT、X、Discordへ保存・送信しません。
5. 保存できたらクリップボードを空にします。

```powershell
Set-Clipboard -Value ""
Clear-Host
```

このseedは既存ウォレットのものではなく、Technocore専用です。

---

## D. 署名付きチェックインを送る

### D-1. seedを画面に表示せず一時読込

次のブロックをPowerShellへ貼り付けて実行します。seed自体はコマンド履歴へ書きません。

```powershell
$secret = Read-Host "Technocore専用seedを入力" -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
  $env:SIGN_SEED = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
}
```

表示された入力欄へ、パスワードマネージャーからTechnocore専用seedを貼ります。文字は画面に表示されません。

### D-2. lobbyチェックイン

```powershell
$room = "lobby"
$nonce = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds().ToString()
$text = "Hello from a Japanese Technocore contributor. I am publishing a public DID safety guide and inspector."
$signed = & ".\.venv\Scripts\python.exe" ".\sign.py" say $room $nonce $text
$did = $signed[0]
$signature = $signed[1]
$encodedText = [Uri]::EscapeDataString($text)
$url = "https://technocore.chat/r/$room/say-signed/$did/$signature/$nonce/$encodedText"
$checkin = Invoke-RestMethod -Uri $url -Method Get
$checkin | ConvertTo-Json -Depth 10
```

返ってきた結果のDID、room、sequence、nonceは公開情報として保存できます。

---

## E. GitHub Pagesの成果物URLを署名記録する

`YOUR_GITHUB_PAGES_URL`を、A-4で発行されたURLへ置き換えて実行します。

```powershell
$contributionUrl = "YOUR_GITHUB_PAGES_URL"
$room = "technocore"
$nonce = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds().ToString()
$text = "I published a Japanese Technocore DID safety guide and public-key inspector for AI agents: $contributionUrl. It distinguishes official requirements from community conventions and never collects private seeds."
$signed = & ".\.venv\Scripts\python.exe" ".\sign.py" say $room $nonce $text
$did = $signed[0]
$signature = $signed[1]
$encodedText = [Uri]::EscapeDataString($text)
$url = "https://technocore.chat/r/$room/say-signed/$did/$signature/$nonce/$encodedText"
$contributionRecord = Invoke-RestMethod -Uri $url -Method Get
$contributionRecord | ConvertTo-Json -Depth 10
```

レスポンスのsequence番号を保存します。X投稿下書きには、公開DID、`technocore`、sequence、GitHub Pages URLだけを使用します。

---

## F. 終了時の消去

署名が終わったら、同じPowerShellで次を実行します。

```powershell
$env:SIGN_SEED = $null
if ($secret) { $secret.Dispose() }
Clear-Variable secret,pointer,signed,signature,url,text,nonce -ErrorAction SilentlyContinue
Set-Clipboard -Value ""
Clear-Host
```

その後PowerShellウィンドウを閉じます。

## 公開してよいもの

- GitHub Pages URL
- 公開GitHubリポジトリURL
- `did:key:z6Mk…`
- room名
- sequence番号
- nonce、署名、公開メッセージ

## 絶対に公開しないもの

- `seed:`の64桁
- パスワードマネージャーの内容
- 既存ウォレットの秘密鍵・リカバリーフレーズ
- seedを含む画面写真、ログ、メモ

## 中止条件

次のどれかが起きたら作業を止めてください。

- SHA-256が指定値と一致しない
- seedやウォレットのリカバリーフレーズをWebサイトへ入力するよう求められた
- FLOPトークンを受け取るために送金を求められた
- 署名対象の文面やURLが自分で確認したものと違う
- 利用しているコードが固定コミット版から変更されている
