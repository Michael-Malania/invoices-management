FROM node:20

WORKDIR /usr/src/app

# Copy and install dependencies for invoice-service
COPY invoice-service/package*.json ./invoice-service/
RUN cd invoice-service && npm install

# Copy and install dependencies for email-sender
COPY email-sender/package*.json ./email-sender/
RUN cd email-sender && npm install

# Copy source code for both services
COPY invoice-service ./invoice-service
COPY email-sender ./email-sender

# Build both services
RUN cd invoice-service && npm run build
RUN cd email-sender && npm run build

EXPOSE 3000

# Use a script to start both services
COPY start-services.sh .
RUN chmod +x start-services.sh

CMD ["./start-services.sh"]