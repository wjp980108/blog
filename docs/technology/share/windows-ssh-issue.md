---
title: 在 Windows 服务器上配置 SSH 公钥认证并解决权限问题
description: 在开发环境中，SSH 公钥认证是一种非常安全且常见的连接服务器方式。在这篇文章中，我将带你一步步完成 如何在 Windows 服务器上配置 SSH 公钥认证，并分享遇到的一些问题及解决方案。
tags: [ Windows, SSH, 公钥认证, 权限问题 ]
sticky: 2
---

# 在 Windows 服务器上配置 SSH 公钥认证并解决权限问题

在开发环境中，SSH 公钥认证是一种非常安全且常见的连接服务器方式。在这篇文章中，我将带你一步步完成 **如何在 Windows 服务器上配置
SSH 公钥认证**，并分享遇到的一些问题及解决方案。

## 前提条件

- 本地电脑为 Windows
- 目标服务器为 Windows

## 步骤 1：在 Windows 服务器上安装并启动 OpenSSH

首先，我们需要确保服务器上已经安装并运行 OpenSSH 服务。

### 安装 OpenSSH

1. 打开 PowerShell 以管理员身份运行，输入以下命令安装 OpenSSH：

   ```powershell
   Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
   ```

2. 安装完成后，启动 OpenSSH 服务并设置为开机自动启动：
   ```powershell
   Start-Service sshd
   Set-Service -Name sshd -StartupType 'Automatic'
   ```

## 步骤 2：生成 SSH 密钥对并上传到服务器

接下来，我们需要生成本地的 SSH 密钥对，并将公钥上传到服务器。

### 生成本地 SSH 密钥对

1. 在本地电脑上，打开 PowerShell 并输入以下命令生成 SSH 密钥对：
   ```powershell
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```
   系统会提示你输入保存路径和密码短语（可选），默认生成 `id_rsa`（私钥） 和 `id_rsa.pub`（公钥）。

### 上传公钥到服务器

1. 使用远程桌面连接到 Windows 服务器，确保 `.ssh` 目录存在。运行以下命令：
   ```powershell
   mkdir $env:USERPROFILE\.ssh
   ```

2. 将本地生成的 `id_rsa.pub` 文件内容复制到服务器的 `authorized_keys` 文件中：
    - 打开 `authorized_keys` 文件（如果文件不存在，创建一个）：
      ```powershell
      notepad $env:USERPROFILE\.ssh\authorized_keys
      ```
    - 将本地的 `id_rsa.pub` 内容粘贴进去并保存。

## 步骤 3：配置文件和权限设置

为了确保 SSH 服务能够正确读取公钥文件，需要进行一些配置和权限设置。

### 配置 SSH 服务

1. 打开 SSH 服务的配置文件 `sshd_config`，确认以下设置：
   ```powershell
   notepad C:\ProgramData\ssh\sshd_config
   ```

2. 确保以下内容未被注释：
   ```plaintext
   PubkeyAuthentication yes
   AuthorizedKeysFile .ssh/authorized_keys
   ```

3. 保存文件后，重启 SSH 服务：
   ```powershell
   Restart-Service sshd
   ```

### 设置权限

确保 `.ssh` 目录和 `authorized_keys` 文件有正确的权限，以便 SSH 服务可以读取。

1. 为 `.ssh` 目录和 `authorized_keys` 文件授予当前用户完全控制权限：
   ```powershell
   icacls $env:USERPROFILE\.ssh /grant Administrator:F
   icacls $env:USERPROFILE\.ssh\authorized_keys /grant Administrator:F
   ```

2. 添加 SYSTEM 用户的读取权限，以确保服务可以访问：
   ```powershell
   icacls $env:USERPROFILE\.ssh /grant SYSTEM:RX
   icacls $env:USERPROFILE\.ssh\authorized_keys /grant SYSTEM:RX
   ```

3. 移除不必要的继承权限：
   ```powershell
   icacls C:\Users\Administrator\.ssh\authorized_keys /inheritance:r
   ```

## 步骤 4：测试 SSH 公钥认证

现在我们已经完成了服务器的设置，接下来可以从本地电脑通过 SSH 公钥进行连接。

### 使用 SSH 公钥连接服务器

1. 在本地电脑上，使用以下命令测试连接：

```powershell
ssh -i $env:USERPROFILE\.ssh\id_rsa Administrator@<YourServerIPAddress>
```

如果配置正确，你应该可以直接通过公钥登录，而无需输入密码。

## 步骤 5：优化密码短语问题（可选）

如果你在生成 SSH 私钥时设置了密码短语，那么每次使用私钥时，系统会要求你输入该密码短语。如果不希望每次都输入密码短语，可以选择以下方法进行优化。

### 1. 移除私钥密码短语

你可以使用 `ssh-keygen` 命令来移除私钥的密码短语，具体操作是通过不设置新密码来实现：

```powershell
ssh-keygen -p -f $env:USERPROFILE\.ssh\id_rsa
```

系统会提示输入当前密码短语，然后你可以选择将新密码短语留空来移除密码。

### 2. 使用 SSH Agent 缓存密码短语

SSH Agent 可以缓存私钥的密码短语，从而避免每次都输入：

1. 检查 `ssh-agent` 服务的状态
    ```powershell
    Get-Service ssh-agent
    ``` 

2. 如果该服务没有显示，说明它还没有安装或启用。可以通过以下步骤启用它。
    - 打开 PowerShell 以管理员身份运行，安装 `ssh-agent` 服务：
      ```powershell
      Add-WindowsCapability -Online -Name OpenSSH.Client~~~~
      ``` 
      
    - 确保 `ssh-agent` 服务已经被安装后，设置该服务为自动启动：
      ```powershell
      Set-Service -Name ssh-agent -StartupType Automatic
      ```
     
    - 启动 `ssh-agent` 服务：
      ```powershell
      Start-Service ssh-agent
      ```

3. 将私钥添加到 SSH Agent：
    ```powershell
    ssh-add $env:USERPROFILE\.ssh\id_rsa
    ```
   
   这样，SSH Agent 会记住私钥密码短语，之后的连接就无需再次输入密码了。   

4. 从 SSH Agent 中移除私钥：
    ```powershell
    ssh-add -d $env:USERPROFILE\.ssh\id_rsa
    ```



## 总结

在这篇文章中，我们介绍了如何在 Windows 服务器上配置 SSH 公钥认证，并解决了常见的权限问题。如果你希望进一步优化连接体验，可以选择移除私钥密码短语或者使用
SSH Agent 来缓存私钥。

通过这些步骤，你现在应该能够顺利通过 SSH 公钥认证来连接 Windows 服务器。如果你遇到了其他问题或有任何疑问，欢迎留言讨论！



