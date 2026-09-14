# syntax=docker/dockerfile:1

# LOKALOKA landing page
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Copy the complete project into the image.
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
