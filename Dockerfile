# use the ready to use Node.js dockerfile.
FROM node

# Create a Directory for the Nodeo.js application and CD into it.
RUN mkdir -p /app/keywords
WORKDIR /app/keywords

# Load our application's code inside.
ADD . /app/keywords
RUN npm install

# Add AWS credentials folder. We will mount the host credentials upon excecution.
RUN cd ~ && mkdir -p .aws && mv /app/keywords/credentials ~/.aws/credentials

EXPOSE 3000

CMD ["node", "app.js"]
