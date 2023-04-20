ssh root@118.25.178.150 "rm -rf /usr/share/nginx/html/tasks/*"
echo 'deleted /usr/share/nginx/html/tasks/*'
scp -r ./dist/* root@118.25.178.150:/usr/share/nginx/html/tasks/
echo 'sync complete'
