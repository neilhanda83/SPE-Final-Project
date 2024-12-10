# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build 

# Set the environment variable to serve the production build
ENV NODE_ENV=production

# Expose port 80 for the application to run
EXPOSE 80

# Start the application using Nginx to serve the static files
CMD ["npm", "start"]
