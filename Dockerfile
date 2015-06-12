# This is the Dockerfile for running the Node.js keywords application.
# Execution example: docker run --name NAME -v ~/.aws/:~/.aws/:ro -p 3000:3000 keywords
#
# Comment: The mounting of the AWS credentials folder is needed in order to access the AWS API (which is used by the app).
# 		   Currently the mounting feature has known issues in some Linux distribution (e.g. ubuntu 14.04).
#		   Since I'm using the ubuntu 14.04 distribution, I have tested the Dockerfile while explicitly adding the AWS folder to the container.
#		   This can be achieved by running the following command after the npm install phase (RUN cd ~ && mkdir -p .aws && mv /app/keywords/credentials ~/.aws/credentials).
#		   The above testing solution was removed from the Dockerfile prior to the submission.
#		   Execution example: run --name NAME -p 3000:3000 keywords

# use the ready to use Node.js dockerfile.
FROM node

# Create a Directory for the Node.js application and CD into it.
RUN mkdir -p /app/keywords
WORKDIR /app/keywords

# Load our application's code inside.
ADD . /app/keywords
RUN npm install

# Add AWS credentials folder. We will mount the host credentials upon excecution.
RUN cd ~ && mkdir -p .aws && mv /app/keywords/credentials ~/.aws/credentials

EXPOSE 3000

CMD ["node", "app.js"]