# Use an official Python 3.9 image with an Alpine Linux base
FROM python:3.9-alpine

# Set the working directory
WORKDIR /app/services

# Copy the requirements file first to leverage Docker cache
COPY ./services/requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY ./services .

# Expose the port that Django will run on
EXPOSE 8000

# Specify the default command to run the Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
