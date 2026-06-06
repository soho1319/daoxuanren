#!/bin/bash
# publish.sh - 每天运行一次，从 publish-queue/ 发布 2-3 篇文章到 blog/
# 用法: ./publish.sh [数量]  默认每次发布 3 篇

set -e
cd "$(dirname "$0")"

COUNT=${1:-3}
QUEUE_DIR="publish-queue"
BLOG_DIR="src/content/blog"
TODAY=$(date +%Y-%m-%d)

# 按发布计划顺序读取
if [ ! -f "$QUEUE_DIR/schedule.txt" ]; then
  echo "❌ 没有找到 $QUEUE_DIR/schedule.txt 发布计划"
  exit 1
fi

# 取前 N 篇未发布的文章
PUBLISHED=0
while IFS= read -r filename; do
  # 跳过空行和注释
  [[ -z "$filename" || "$filename" == \#* ]] && continue

  # 检查文件是否还在队列中
  if [ -f "$QUEUE_DIR/$filename" ]; then
    # 更新 pubDate 为今天（兼容 macOS BSD sed 和 Linux/Windows GNU sed）
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s/^pubDate:.*$/pubDate: $TODAY/" "$QUEUE_DIR/$filename"
    else
      sed -i "s/^pubDate:.*$/pubDate: $TODAY/" "$QUEUE_DIR/$filename"
    fi

    # 移动到 blog 目录
    mv "$QUEUE_DIR/$filename" "$BLOG_DIR/$filename"
    echo "✅ 已发布: $filename (日期: $TODAY)"

    PUBLISHED=$((PUBLISHED + 1))
    if [ $PUBLISHED -ge $COUNT ]; then
      break
    fi
  fi
done < "$QUEUE_DIR/schedule.txt"

if [ $PUBLISHED -eq 0 ]; then
  echo "📭 队列已空，所有文章都发布完了！"
else
  echo ""
  echo "📝 今日发布 $PUBLISHED 篇文章"
  echo "📋 队列剩余: $(ls "$QUEUE_DIR"/*.md 2>/dev/null | wc -l | tr -d ' ') 篇"
  echo ""
  echo "下一步: 运行 npm run build && 部署到 Cloudflare"
fi
