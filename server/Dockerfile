# Use official Node.js image

FROM node:18

# Create working directory inside container

WORKDIR /app

# Copy package files first

COPY package*.json ./

# Install backend dependencies

RUN npm install

# Copy all backend files into container

COPY . .

# Expose backend port

EXPOSE 5000

# Start backend server

CMD ["npm", "start"]