<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Simple FTP upload

With this Action, you can upload folder contents to an FTP server. **Overwrites existing files on the server!**

This Action uploads files straight to the FTP server, without keeping a sync state. If you need a sync state, consider using [SamKirkland/FTP-Deploy-Action](https://github.com/marketplace/actions/ftp-deploy) instead.

## Basic usage

```YAML
  uses: dennisameling/ftp-upload-action@v1
  with:
    server: ${{ secrets.FTP_SERVER }}
    username: ${{ secrets.FTP_USER }}
    password: ${{ secrets.FTP_PASSWORD }}
    local_dir: ./ # Should always end with /
    server_dir: ./ # Should always end with /
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
| local_dir | Path to upload to on the server. Must end with trailing slash / | no | ./ |
