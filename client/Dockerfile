# Use Node.js image

FROM node:18

# Create app directory

WORKDIR /app

# Copy package files

COPY package*.json ./

# Install dependencies

RUN npm install

# Copy all frontend files

COPY . .

# React frontend port

EXPOSE 3000

# Start React app

CMD ["npm", "start"]