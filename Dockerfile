FROM node:12.14
LABEL maintainer 'Bruno Ritter <brunosk8123@hotmail.com>'

ENV scrumpoker_connection_string = ${scrumpoker_connection_string}

RUN npm install -g @angular/cli@8.1.0 && \
	mkdir /app && \
	cd /app && \
	git clone https://github.com/brunoritter123/pointingPoker.git --depth 1 && \
	git clone https://github.com/brunoritter123/backPointingPoker.git --depth 1 && \
	cd backPointingPoker && \
	npm install && \
	cd .. && \
	cd pointingPoker && \
	npm install && \
	echo 'export const environment = { production: true, API: "localhost:3000" }; ' \
	> src/environments/environment.prod.ts && \
	ng build --prod && \
	cd .. && \
	cp -r pointingPoker/dist backPointingPoker/config

WORKDIR /app/backPointingPoker
EXPOSE 3000
CMD npm start
