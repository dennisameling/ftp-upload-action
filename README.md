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

### TLS 1.3 FTPS servers are not supported

This Action uses [`basic-ftp`](https://github.com/patrickjuchli/basic-ftp), which does not yet support TLS 1.3 session resumption on the data channel (see [basic-ftp#60](https://github.com/patrickjuchli/basic-ftp/issues/60)). If your FTP server negotiates TLS 1.3, most data connections will fail and you will see errors like:

```
FTPError: 425 Unable to build data connection: Operation not permitted
400 level error from server when performing action - retrying...
Error: Error while transferring one or more files: FTPError: 425 Unable to build data connection: Operation not permitted
```

Until the upstream issue is resolved, the workaround is to force the server to use TLS 1.2 for FTPS. On ProFTPd (e.g. Plesk), add the following to your config:

```
TLSProtocol TLSv1.2
```

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
