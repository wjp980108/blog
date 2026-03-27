---
title: SSH 安装与基础使用指南
description: 本文介绍如何在 Windows、Linux、macOS 三个平台上安装 SSH 客户端与服务端，并演示基础连接操作，帮助你快速上手远程管理。
tags: [ SSH, Windows, Linux, macOS, 远程连接 ]
---

# SSH 安装与基础使用指南

SSH（Secure Shell）是一种加密网络协议，用于安全地远程登录和管理服务器。本文将介绍如何在 Windows、Linux、macOS 三个平台上安装 SSH，并演示基础使用方式。

## 基本概念

- **SSH 客户端**：用于连接远程服务器，本地机器需要安装
- **SSH 服务端（sshd）**：运行在被连接的服务器上，用于接受连接请求
- 默认端口：**22**

---

## Windows

### 安装 SSH 客户端

Windows 10（1809 及以上）和 Windows 11 内置了 OpenSSH，可通过以下方式安装：

**方式一：通过系统设置**

1. 打开「设置」→「应用」→「可选功能」
2. 点击「添加功能」，搜索 `OpenSSH 客户端`
3. 点击安装

**方式二：通过 PowerShell（管理员）**

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

安装完成后验证：

```powershell
ssh -V
```

### 安装 SSH 服务端

如果你的 Windows 机器需要被远程连接，还需安装服务端：

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

安装完成后验证：

```powershell
Get-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

输出 `State: Installed` 表示安装成功，再启动服务并设置开机自启：

```powershell
# 启动服务
Start-Service sshd
# 设置开机自启
Set-Service -Name sshd -StartupType Automatic
```

### 基础使用

**连接远程服务器：**

```powershell
ssh 用户名@服务器IP
```

例如：

```powershell
ssh root@192.168.1.100
```

**指定端口：**

```powershell
ssh -p 2222 用户名@服务器IP
```

---

## Linux

### 安装 SSH 客户端

大多数 Linux 发行版已预装 SSH 客户端。如未安装，根据发行版执行以下命令：

**Debian / Ubuntu：**

```bash
sudo apt update
sudo apt install openssh-client
```

**CentOS / RHEL / Fedora：**

```bash
sudo dnf install openssh-clients
# 或旧版 CentOS
sudo yum install openssh-clients
```

**Arch Linux：**

```bash
sudo pacman -S openssh
```

验证安装：

```bash
ssh -V
```

### 基础使用

**连接远程服务器：**

```bash
ssh 用户名@服务器IP
```

例如：

```bash
ssh root@192.168.1.100
```

**指定端口：**

```bash
ssh -p 2222 用户名@服务器IP
```

---

## macOS

### 安装 SSH 客户端

macOS 系统自带 OpenSSH 客户端，无需额外安装，直接在终端使用即可：

```bash
ssh -V
```

如果需要升级到最新版本，可通过 Homebrew 安装：

```bash
brew install openssh
```

### 基础使用

**连接远程服务器：**

```bash
ssh 用户名@服务器IP
```

例如：

```bash
ssh root@192.168.1.100
```

**指定端口：**

```bash
ssh -p 2222 用户名@服务器IP
```

**使用 SSH 配置文件简化连接（三个平台通用）：**

编辑 `~/.ssh/config`（Windows 路径为 `C:\Users\用户名\.ssh\config`），写入以下内容：

```
Host myserver
    HostName 192.168.1.100
    User root
    Port 22
```

之后直接使用别名连接：

```bash
ssh myserver
```

> **Windows 提示：** 如果 `config` 文件不存在，需要先手动创建。
>
> 1. 在 PowerShell 中创建文件：
>    ```powershell
>    New-Item -Path "$env:USERPROFILE\.ssh\config" -ItemType File -Force
>    ```
> 2. 用记事本打开编辑：
>    ```powershell
>    notepad $env:USERPROFILE\.ssh\config
>    ```

---

## 总结

**各平台安装方式：**

| 平台 | 客户端安装 | 服务端安装 |
|------|-----------|-----------|
| Windows | 可选功能 / PowerShell 命令 | 可选功能 / PowerShell 命令 |
| Linux | 包管理器（apt / dnf / pacman） | 通常已预装 |
| macOS | 系统自带，可选 Homebrew 升级 | — |

**常用连接命令速查：**

| 场景 | 命令 |
|------|------|
| 基础连接 | `ssh 用户名@服务器IP` |
| 指定端口 | `ssh -p 端口 用户名@服务器IP` |
| 使用配置别名 | `ssh 别名` |

SSH 是日常开发和运维中必不可少的工具。本文涵盖了三个平台的安装方式和基础连接操作，能满足大多数日常使用场景。如果需要免密登录或管理多台服务器，可以进一步了解 [SSH 密钥认证](./ssh-key) 的相关内容。
