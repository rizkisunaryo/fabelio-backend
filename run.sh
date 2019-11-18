docker-compose -f stack.yml up -d
docker run -d --hostname my-rabbit --name some-rabbit -p 8080:15672 -p 5672:5672 rabbitmq:3-management
nohup yarn dev FABELIO > ./logs/api.log &
nohup yarn crawler FABELIO > ./logs/crawler.log &
nohup yarn scheduler-dev FABELIO > ./logs/scheduler.log &