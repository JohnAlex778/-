# 电力交易平台部署指南

## 方案一：GitHub Pages 部署（推荐用于测试环境）

1. 创建 GitHub 仓库
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repository-url
git push -u origin main
```

2. 在 GitHub 仓库设置中启用 GitHub Pages
   - 进入仓库的 Settings > Pages
   - 选择 main 分支作为源
   - 保存设置

## 方案二：Nginx 部署（推荐用于生产环境）

1. 安装 Nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS
sudo yum install nginx
```

2. 配置 Nginx
```bash
# 复制项目文件到服务器
sudo mkdir -p /var/www/power-trading-platform
sudo cp -r * /var/www/power-trading-platform/

# 配置 Nginx
sudo cp nginx.conf /etc/nginx/sites-available/power-trading-platform
sudo ln -s /etc/nginx/sites-available/power-trading-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

3. 配置 SSL（推荐）
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com
```

## 方案三：Docker 部署

1. 构建 Docker 镜像
```bash
docker build -t power-trading-platform .
```

2. 运行容器
```bash
docker run -d -p 80:80 power-trading-platform
```

## 注意事项

1. 域名解析
   - 确保您的域名已正确解析到服务器 IP

2. 安全配置
   - 启用 HTTPS
   - 配置防火墙规则
   - 定期更新系统和依赖

3. 性能优化
   - 启用 Gzip 压缩
   - 配置浏览器缓存
   - 使用 CDN 加速

4. 监控和维护
   - 设置日志监控
   - 配置性能监控
   - 定期备份

## 故障排除

1. 无法访问网站
   - 检查防火墙设置
   - 验证 Nginx 配置
   - 检查域名解析

2. 性能问题
   - 检查服务器资源使用情况
   - 优化静态资源
   - 检查数据库性能 