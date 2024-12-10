PREVIOUS_CONTAINER=$(docker ps --format "table {{.ID}}  {{.Names}}  {{.CreatedAt}}" | grep quebradev-api | awk -F  "  " '{print $1}')

echo "Starting rolling update"
docker ps --format "table {{.ID}} {{.Names}} {{.CreatedAt}}"

git pull origin master \
    && docker-compose -f docker-compose.production.yaml up -d --remove-orphans --no-deps --scale api=2 --no-recreate api \
    && docker-compose -f docker-compose.production.yaml exec nginx nginx -s reload \
    && docker kill -s SIGTERM $PREVIOUS_CONTAINER \
    && docker-compose -f docker-compose.production.yaml up -d --remove-orphans --no-deps --scale api=1 --no-recreate api

echo "Rolling update done"
docker ps --format "table {{.ID}} {{.Names}} {{.CreatedAt}}"
