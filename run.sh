NAME=custom-basket-ui
docker stop $NAME
docker rm $NAME
docker build -t $NAME . && docker run -p 8001:80 $NAME