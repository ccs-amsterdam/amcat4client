#!/usr/bin/sh
export PUBLIC_URL=https://example.com/amcat
npm run build
echo "Do not forget to move the build directory to the appropriate directory for your web server, such as /var/www/html/amcat"
