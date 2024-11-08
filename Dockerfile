FROM python:3.10

WORKDIR /app
COPY . /app

RUN curl -sSL https://install.python-poetry.org | python3 -
    
ENV POETRY_HOME="/root/.local/bin/"
ENV PATH="$POETRY_HOME:$PATH"
RUN poetry install --no-interaction

EXPOSE 8000
CMD poetry run python manage.py runserver 0.0.0.0:8000
