---
title: SSH 密钥认证指南
description: 介绍 SSH 密钥的原理、在 Windows/Linux/macOS 上生成密钥、上传公钥到服务器实现免密登录，以及安全注意事项和常见问题排查。
tags: [ SSH, 密钥认证, Windows, Linux, macOS, 安全 ]
---

# SSH 密钥认证指南

SSH 密钥认证是比密码登录更安全、更便捷的远程登录方式。本文介绍密钥的原理、生成方法、上传流程，以及使用中需要注意的安全事项和常见问题排查。

## 基本概念

SSH 密钥认证基于**非对称加密**，会生成一对密钥：

- **私钥**（`id_ed25519`）：保存在本地，绝对不能泄露
- **公钥**（`id_ed25519.pub`）：上传到服务器，可以公开

登录时，服务器用公钥加密一段随机数据，只有持有对应私钥的客户端才能解密——这就完成了身份验证，全程无需传输密码。

与密码登录相比，密钥认证的优势：
- 无法被暴力破解（密钥长度远超任何密码）
- 不存在密码泄露风险
- 配合 `passphrase` 还可加一层本地保护

---

## 生成密钥

生成命令在三个平台上基本一致，都使用 `ssh-keygen` 工具。

### Ed25519（推荐）

Ed25519 是目前推荐的现代算法，密钥短、速度快、安全性高：

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

`-C` 参数是注释，用于标识密钥用途或所有者，可以填邮箱、主机名或任意备注。

### RSA（兼容老系统）

如果目标服务器较老，不支持 Ed25519，改用 RSA：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

`-b 4096` 指定密钥长度为 4096 位，安全性更高。

### 生成过程说明

执行命令后会有三个交互步骤：

```
Enter file in which to save the key (~/.ssh/id_ed25519):
```
直接回车使用默认路径。如果已有同名密钥，可以指定其他文件名，例如 `~/.ssh/id_ed25519_work`。

```
Enter passphrase (empty for no passphrase):
```
`passphrase` 是加密私钥文件的本地密码，相当于"密钥的密码"。建议设置，这样即使私钥文件被盗也无法直接使用。日常使用中可配合 `ssh-agent` 避免每次都输入。

生成完成后，密钥文件保存在：

| 平台 | 默认路径 |
|------|---------|
| Linux / macOS | `~/.ssh/` |
| Windows | `C:\Users\用户名\.ssh\` |

> **Windows 说明：** `ssh-keygen` 需要先安装 OpenSSH 客户端（参考 [SSH 安装与基础使用指南](./ssh-install)）。在 PowerShell 中执行上述命令即可，路径格式与 Linux 类似，`~` 等价于 `C:\Users\用户名`。

---

## 上传公钥到服务器

生成密钥后，需要将**公钥**内容追加到服务器的 `~/.ssh/authorized_keys` 文件中。

### 方式一：ssh-copy-id（推荐）

Linux 和 macOS 自带 `ssh-copy-id`，一条命令搞定：

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub 用户名@服务器IP
```

执行时需要输入一次服务器密码，之后就可以免密登录了。

> **Windows 说明：** Windows 默认没有 `ssh-copy-id`，使用下方的手动方式，或者在 WSL / Git Bash 中执行此命令。

### 方式二：手动追加

适用于所有平台，也适合服务器无法直接密码登录的情况。

**第一步，查看本地公钥内容：**

```bash
cat ~/.ssh/id_ed25519.pub
```

输出类似：

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... your_email@example.com
```

**第二步，登录服务器，将公钥追加到 `authorized_keys`：**

```bash
mkdir -p ~/.ssh
echo "公钥内容粘贴到这里" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

注意使用 `>>` 追加，不要用 `>` 覆盖，否则会清空已有的公钥。

---

## 验证连接

上传完成后，退出服务器重新连接，验证密钥登录是否生效：

```bash
ssh 用户名@服务器IP
```

如果设置了 passphrase，此时会提示输入。成功登录则说明配置正确。

**使用 `-v` 参数查看详细连接过程（排错时有用）：**

```bash
ssh -v 用户名@服务器IP
```

---

## 注意事项

### 安全

**私钥权限必须正确**

Linux / macOS 上私钥文件的权限必须是 `600`，否则 SSH 会拒绝使用：

```bash
chmod 600 ~/.ssh/id_ed25519
chmod 700 ~/.ssh
```

Windows 上需要确保私钥文件只有当前用户有权限读取，去掉 `Administrators` 和 `SYSTEM` 等其他账户的权限，或者在文件属性 → 安全中只保留当前用户。

**不要共享或复制私钥**

私钥是身份凭证，不要通过邮件、聊天工具或粘贴板传输。每台设备应该生成自己的密钥对，然后分别将公钥上传到服务器。

**建议设置 passphrase**

没有 passphrase 的私钥文件一旦泄露，攻击者可以直接登录所有配置了对应公钥的服务器。建议设置，并通过 `ssh-agent` 管理，避免每次输入的麻烦：

```bash
# 启动 ssh-agent（Linux / macOS）
eval "$(ssh-agent -s)"
# 添加私钥，输入一次 passphrase 后本次会话内不再需要重复输入
ssh-add ~/.ssh/id_ed25519
```

### 常见问题排查

**`Permission denied (publickey)`**

最常见的原因：
1. 公钥没有正确写入服务器的 `authorized_keys`
2. `authorized_keys` 或 `.ssh` 目录权限不正确（参考上方权限设置）
3. 服务器的 `sshd_config` 未开启公钥认证（检查 `PubkeyAuthentication yes`）

用 `ssh -v` 查看详细日志，定位是哪一步失败。

**`Bad permissions` / `Permissions are too open`**

私钥文件权限过宽，SSH 拒绝加载。Linux / macOS 执行：

```bash
chmod 600 ~/.ssh/id_ed25519
```

Windows 参考上方权限设置部分处理。

**`Agent admitted failure to sign using the key`**

私钥未加入 `ssh-agent`，执行：

```bash
ssh-add ~/.ssh/id_ed25519
```

**连接时仍然提示输入密码**

可能原因：
- 服务器端 `authorized_keys` 文件权限有问题
- `sshd_config` 中 `AuthorizedKeysFile` 配置路径不匹配
- 首次连接时 `known_hosts` 中没有服务器指纹，需要确认后才能继续

---

## 总结

| 步骤 | 命令 |
|------|------|
| 生成 Ed25519 密钥 | `ssh-keygen -t ed25519 -C "备注"` |
| 生成 RSA 密钥 | `ssh-keygen -t rsa -b 4096 -C "备注"` |
| 上传公钥 | `ssh-copy-id -i ~/.ssh/id_ed25519.pub 用户名@IP` |
| 修复私钥权限 | `chmod 600 ~/.ssh/id_ed25519` |
| 添加到 ssh-agent | `ssh-add ~/.ssh/id_ed25519` |

SSH 密钥认证配置完成后，就可以彻底告别密码登录了。如果管理多台服务器，建议结合 `~/.ssh/config` 配置别名，进一步简化日常操作。
