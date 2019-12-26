FROM nginx:1.15.7-alpine
RUN apk add curl jq

COPY docker-entrypoint.sh /usr/share/nginx/html
RUN chmod +x /usr/share/nginx/html/docker-entrypoint.sh

COPY /nginx.conf  /etc/nginx/conf.d/default.conf

COPY ./build/ /usr/share/nginx/html/tori

WORKDIR /usr/share/nginx/html
ENTRYPOINT ["./docker-entrypoint.sh"] 
CMD ["nginx", "-g", "daemon off;"]