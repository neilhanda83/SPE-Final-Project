# Use an official Node.js runtime as a parent image
FROM node:18-alpine as build

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./
# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .
# Build the application
RUN npm run build 

# Serve the app using Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 3000 for the application to run
EXPOSE 3000

# Start the application using Nginx to serve the static files
CMD ["nginx", "-g", "daemon off;"]