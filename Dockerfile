FROM python:3.14-alpine

RUN python3 -m pip install websockets

WORKDIR /app
COPY estimation_poker.py /app/
COPY index.html /app/

ENTRYPOINT [ "python3", "estimation_poker.py" ]
