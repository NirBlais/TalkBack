FROM python:3.13-alpine

WORKDIR /app
COPY ./requirements.txt /app
RUN pip install --no-cache-dir --requirement /app/requirements.txt
COPY . /app

EXPOSE 5175

CMD ["python", "server.py"]


