# GitHub Actions 自动发布

每天 UTC 01:00（北京时间 09:00）自动发布 1 篇文章。

## 一次性配置

### 1. 创建 GitHub PAT

需要一个有 `repo` 权限的 Personal Access Token：

1. 打开 https://github.com/settings/tokens/new
2. Note: `daoxuanren-auto-publish`
3. Expiration: 选个长一点（90 天 / 1 年）
4. Scopes: 勾上 **`repo`**（全部子项）
5. 点 Generate token
6. **复制 token**（只显示一次！）

### 2. 把 token 存到仓库 Secrets

1. 打开 https://github.com/soho1319/daoxuanren/settings/secrets/actions/new
2. Name: `PUSH_TOKEN`
3. Value: 粘贴刚才的 token
4. 点 Add secret

### 3. 把 workflow 文件 push 上去

```bash
git add .github/
git commit -m "ci: 添加每日自动发布 workflow"
git push origin main
```

### 4. 验证

打开 https://github.com/soho1319/daoxuanren/actions 看 `Daily Publish` 任务：
- 第一次可以点 "Run workflow" 手动触发一次
- 看日志确认文章成功发布

## 修改定时时间

编辑 `.github/workflows/daily-publish.yml` 里的 cron 表达式：

```yaml
schedule:
  - cron: '0 1 * * *'   # UTC 时间
```

UTC → 北京时间对照：
- `0 1 * * *` = 北京时间 09:00
- `0 9 * * *` = 北京时间 17:00
- `0 17 * * *` = 北京时间 次日 01:00

测试工具：https://crontab.guru/
