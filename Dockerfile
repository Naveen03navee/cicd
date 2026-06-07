FROM node:18-alpine
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose port and run the app
EXPOSE 3000
CMD ["npm", "start"]