# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally (for development)
RUN npm install -g nodemon

# Copy the rest of the application code to the container
COPY . .

# Expose port 5000 (or whichever port your server runs on)
EXPOSE 5000

# Start the application using nodemon
CMD ["nodemon", "index.js"]
