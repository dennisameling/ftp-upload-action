<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Simple FTP upload

With this Action, you can upload folder contents to an FTP server. **Overwrites existing files on the server!**

This Action uploads files straight to the FTP server, without keeping a sync state. If you need a sync state, consider using [SamKirkland/FTP-Deploy-Action](https://github.com/marketplace/actions/ftp-deploy) instead.

Tested and works on:
- `ubuntu-latest`
- `windows-latest`
- `macos-latest`

## Basic usage

```YAML
  uses: dennisameling/ftp-upload-action@v2
  with:
    server: ${{ secrets.FTP_SERVER }}
    username: ${{ secrets.FTP_USER }}
    password: ${{ secrets.FTP_PASSWORD }}
    local_dir: ./ # Should always end with /
    server_dir: ./ # Should always end with /
```

## Known limitations

### Empty (0-byte) files may fail to upload over FTPS

Some FTPS servers — notably ProFTPd built against OpenSSL 3 (e.g. Debian 12 / recent Plesk) — reject 0-byte file uploads with a TLS `decode_error` alert (`SSL alert number 50`). Workaround: ensure the files you upload are at least 1 byte. See [FTP-Deploy-Action#516](https://github.com/SamKirkland/FTP-Deploy-Action/issues/516) for background.

## Available inputs

| Key | Description | Required | Default |
| --- | --- | --- | --- |
| server | FTP server (hostname or IP) | yes | n/a |
| username | FTP username | yes | n/a |
| password | FTP password | yes | n/a |
| port | FTP port number | no | 21 |
| secure | True uses FTPS, while false uses plain FTP. Defaults to true. | no | true |
| local_dir | Folder to upload from, must end with trailing slash / | no | ./ |
| server_dir | Path to upload to on the server. Must end with trailing slash / | no | ./ |
