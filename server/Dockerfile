# Stage 1: Build the application
FROM node:slim AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install the Encore CLI globally and add to PATH
RUN curl -L https://encore.dev/install.sh | bash && \
    export ENCORE_INSTALL="/root/.encore" && \
    export PATH="$ENCORE_INSTALL/bin:$PATH"

# Build the application using the Encore CLI with full path
RUN /root/.encore/bin/encore build

# Stage 2: Create the production image
FROM node:slim

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app /app

# Expose the application port
EXPOSE 4000

# Set the environment variable for the port
ENV PORT=4000

# Start the application
CMD ["/root/.encore/bin/encore", "run"]
