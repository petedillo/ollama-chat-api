FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose API port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
