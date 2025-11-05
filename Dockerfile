# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /Users/conra/discord-bot/free-games-bot

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the bot’s code
COPY . .

# Run the bot
CMD ["node", "index.js"]
