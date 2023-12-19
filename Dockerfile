
# Use an official Node.js runtime as the base image
FROM node:18.10.0
LABEL authors="luksiko"

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT=3000

EXPOSE $PORT

#
#RUN npm install pm2 -g
#ENV PM2_PUBLIC_KEY pbcymyzxt7v5arh
#ENV PM2_SECRET_KEY mdeysk0t2vw2nxr
#
#CMD ["pm2-runtime", "index.js"]

CMD ["npm", "start"]