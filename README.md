# Architecture

![Fabelio Crawler](https://user-images.githubusercontent.com/2413398/69009888-8afb0700-098c-11ea-86e6-1d3ab1caa527.png)

## By API
URL can be inserted by API. The flow is shown with green line in the picture above
1. User insert URL. The API will then insert the URL to MongoDB
2. API will add the URL to the Queue as well
3. Queue will send the URL to Crawler
4. Crawler will crawl the details of the URL
5. URL details will be saved to MongoDb

## By Scheduler
1. Scheduler get the URLs from MongoDB
2. And then, the Scheculer will add the URLs to the Queue
3. Queue will send the URL to Crawler
4. Crawler will crawl the details of the URL
5. URL details will be saved to MongoDb

# Installation
- Install `yarn` https://yarnpkg.com/en/docs/install
- Install `Docker` https://www.docker.com/products/docker-desktop
- Run `yarn install` in terminal, in this project root folder

# How to Run
1. Run MongoDB: `docker-compose -f stack.yml up`
2. Run RabbitMQ: `docker run -d --hostname my-rabbit --name some-rabbit -p 8080:15672 rabbitmq:3-management`
3. Run backend, by running `yarn dev` in terminal, in this project root folder
