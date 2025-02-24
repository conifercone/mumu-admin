#!/bin/bash

# 检查当前目录是否是一个 Git 仓库
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "错误：当前目录不是 Git 仓库，请切换到正确的 Git 仓库目录。"
    exit 1
fi

# 检查是否已初始化 Git Flow
if git flow version > /dev/null 2>&1; then
    # 检查 .git/config 中是否有 gitflow 配置
    if git config --get-regexp '^gitflow\.' > /dev/null 2>&1; then
        echo "Git Flow 已初始化，跳过初始化步骤。"
        exit 0
    fi
else
    echo "警告：git-flow 工具未安装，请先安装 git-flow。"
    echo "Ubuntu: sudo apt-get install git-flow"
    echo "macOS: brew install git-flow"
    exit 1
fi

# 检查本地是否存在 develop 分支
if git show-ref --verify --quiet refs/heads/develop; then
    echo "本地存在 develop 分支，继续初始化 Git Flow。"
else
    echo "本地不存在 develop 分支，尝试从远程检出。"
    # 检查远程是否存在 develop 分支
    if git ls-remote --exit-code --heads origin develop > /dev/null 2>&1; then
        git fetch origin
        git checkout develop
        echo "已成功检出远程 develop 分支。"
    else
        echo "错误：远程仓库中不存在 develop 分支，请确保远程仓库已配置。"
        exit 1
    fi
fi

# 初始化 Git Flow 并设置指定配置
echo "正在初始化 Git Flow..."
git flow init -f <<EOF
main
develop
feature/
release/
hotfix/
v
EOF

# 检查初始化是否成功
if [ $? -eq 0 ]; then
    echo "Git Flow 初始化成功！"
    echo "主分支: main"
    echo "开发分支: develop"
    echo "功能分支前缀: feature/"
    echo "发布分支前缀: release/"
    echo "修复分支前缀: hotfix/"
    echo "Tag 前缀: v"
else
    echo "错误：Git Flow 初始化失败，请检查配置或权限。"
    exit 1
fi
