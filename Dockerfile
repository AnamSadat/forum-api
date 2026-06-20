# Use the official Node.js image based on Alpine Linux
FROM node:22-alpine

# Update security os alpine
RUN apk update && apk upgrade --no-cache

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies for production (clean install)
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]