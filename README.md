## Installation

`npm install --legacy-peer-deps`

## Running Flic

#### CORS:

Flic's backend API has strict CORS origin of `beta.watchflic.com`. You can either:

- Use a browser extension to bypass CORS
- Run Chrome via CLI with CORS disabled:
    - Windows: 
    ```bash
    chrome.exe --disable-site-isolation-trials --disable-web-security --user-data-dir="D:\temp"
    ```
    - Linux: 
    ```bash
    google-chrome --disable-site-isolation-trials --disable-web-security --user-data-dir="~/tmp"
    ```

#### NPM:

`npm start`

#### SASS:
Start SASS Watcher.

```bash
sass --watch public/scss/index.scss:public/style.css
```

## Documentation:

Todo.


