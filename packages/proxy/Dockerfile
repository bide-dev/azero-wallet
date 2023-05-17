FROM nginx:latest

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom configuration
COPY nginx.conf /etc/nginx/conf.d/
