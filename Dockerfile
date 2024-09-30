# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy the rest of the application code.
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Run the web service on container startup.
CMD ["node", "index.js"]
