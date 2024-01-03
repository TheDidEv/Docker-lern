# Docker-lern 🐳
  [Course](https://www.linkedin.com/learning/docker-for-developers-14493163)
  [Course certificate](https://www.linkedin.com/learning/certificates/88a9de4164c2a1adaaafb69519b5adcb8a38a2f065b5c1e3d7b3dba5bcd2c2e1?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BxhnwvdL6SV2TiWufQzXeUg%3D%3D)

# Summary

## .dockerignore
Еhis is an analogue of .gitignore but for docker

## Dockerfile
```bash
# Використовуємо офіційний образ Node.js як основу
FROM node

# Встановлюємо робочу директорію всередині контейнера
WORKDIR /app

# Копіюємо файл package.json з локального контексту збірки в контейнер
COPY package*.json ./

# Виконуємо команду `npm install` для встановлення залежностей проекту(node_modules)
RUN npm install

# Копіюємо всі файли та папки з поточної директорії збірки в контейнер
COPY . .

# Позначаємо порт 4000 як порт, на якому запущений додаток всередині контейнера
EXPOSE 4000

# Команда, яка виконується при старті контейнера для запуску додатку
CMD ["npm", "start"]
```

Два рази COPY, тому що - такий підхід дозволяє оптимізувати процес збірки образу Docker. Встановлення залежностей окремо перед копіюванням усіх файлів дозволяє скористатися кешем пакетного менеджера (в даному випадку, npm), зменшуючи час збірки образу в разі змін лише в package.json.

- Створення image
```bash
docker build -t username/appname:1.0 . 
```
1.0 - version,  `username/appname` - назва зображення

Щоб подивитися всі зображення використовуємо:
```bash
docker images
```

- Run container
Щоб запустити контейнер використовуємо команду:
```bash
docker run -p 4000:4000 [image id repository]
```
repository - це назва зображення. Див. вище в пункті 'Створення image'.

Щоб зупинити контейнер використовуємо каманду:
```bash
docker stop [container name(id)]
#example: docker stop 0f83 (where 0f84 - firs 4 symbol on ID)
```

## docker-compose.yml

Можна подивитися в цьому репозиторії за шляхом course->Resources->fullstack

Example docker-compose.yml:
```bash
version: '3.9'
services:
  client:
    container_name: client
    restart: always
    build: ./client
    ports: 
      - "3000:3000"
    links: 
      - app
  app:
    container_name: app
    restart: always
    build: ./api
    ports:
      - "4000:4000"
    depends_on:
     - mongo
  mongo: 
    container_name: mongo
    image: mongo
    restart: always
    expose:
      - "27017"
    volumes:
      - ./data:/data/db
    ports:
      - "27017:27017"
```

- client: 
`container_name:` Встановлює ім'я контейнера для цього сервісу як "client".
`restart: always:` Конфігурація для автоматичного перезапуску контейнера в разі його зупинки або помилки.
`build: ./client:` Задає шлях до Dockerfile або контексту збірки для створення образу цього сервісу.
`ports:` Мапування портів контейнера на порти хоста. У цьому випадку, 3000 порт контейнера мапується на порт 3000 хоста.
`links:` Встановлює зв'язок з сервісом app.

- app:
`container_name:` Встановлює ім'я контейнера для цього сервісу як "app".
`restart: always:` Як і у випадку client, це налаштування для автоматичного перезапуску контейнера в разі необхідності.
`build:` ./api: Задає шлях до Dockerfile або контексту збірки для створення образу цього сервісу.
`ports:` Мапування портів контейнера на порти хоста. У цьому випадку, 4000 порт контейнера мапується на порт 4000 хоста.
`depends_on:` Вказує на те, що цей сервіс (app) залежить від сервісу mongo. Це не означає, що сервіс mongo гарантовано повністю запущений, просто дає можливість почекати на його стан перед запуском цього сервісу.

- mongo:
`container_name:` Встановлює ім'я контейнера для цього сервісу як "mongo".
`image: mongo:` Вказує Docker використовувати офіційний образ MongoDB з Docker Hub.
`restart: always:` Налаштування для автоматичного перезапуску контейнера MongoDB у разі його зупинки або помилки.
`expose:` Вказує на те, що контейнер може слухати порт 27017 в межах внутрішньої мережі Docker.
`volumes:` Мапування томів для зберігання даних MongoDB. У цьому випадку, дані MongoDB будуть зберігатися в локальній папці ./data.
`ports:` Мапування портів контейнера на порти хоста. У цьому випадку, 27017 порт контейнера мапується на порт 27017 хоста.


- В докер файлах в api та client повинно буди вказано в полі ```WORKDIR``` теж саме що і в docker-compose в полі ```container_name:```
напр. в api/Dockerfiel в полі поле ```WORKDIR: ./app``` тоді в docker-compose ```container_name: app```

щоб запустити це все використовуємо наступні команди
```bash
# спочатку запускаємо контейнер с mongo, тому що apр контейнер від нього залежний `depends_on:`- mongo(див вище пояснення в docker-compose.yml -> app)
docker-compose up -d mongo

# далі запускаємо app контейнер, тому що client встановлює звязок з app щоб брати дані для клієнта
docker-compose up -d app

# тепер запускаємо клієнт(в нашому випадку він на реакт)
docker-compose up -d client

# щоб зупинити всі контейнери пишемо 
docker-compose stop
```

## Корисні команди

delete all images and containers: 
```bash
docker system prune -a
```

подивитись які контейнери запущені:
```bash
docker ps
```

використовується коли потрібно припинити роботу контейнера, але не виходить зробити через команду ```docker stop``` (напр. цим контейнором користується другий контейнер).
```bash
docker kill
```

щоб подивитися логи контейнера (container id - можна подивитися за допомогою ```docker ps```):
```bash
docker logs [container id]
```

delete image:
```bash
docker rmi [image id]
```

info about docker
```bash
docker info
```


## Docker swarm
- Docker Swarm – це нескладний оркестратор для контейнерів, який доступний з коробки. Аналог Kubernetis.

Initialize docker swarm:
```bash
docker swarm init
```
- ми можемо побачти ID нашого docker swarm за допомогою клманди ```docker info``` -> ```NodeID: [some id]```

- Список вузлів у swarm:
```bash
docker node ls
```
