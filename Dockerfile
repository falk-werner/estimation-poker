FROM python:3.14-alpine

RUN python3 -m pip install textual

WORKDIR /app
RUN mkdir -p /app/room
COPY estimation_poker.py /app/

ENTRYPOINT [ "python3", "/app/estimation_poker.py" ]
