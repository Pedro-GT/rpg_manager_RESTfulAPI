FROM python:3.12-slim

# Defina o diretório de trabalho dentro do container
WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev gcc

# Copie os arquivos de requisitos para o container
COPY requirements.txt /app/

# Instale as dependências Python
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt --verbose


# Copie todo o código do projeto para o diretório de trabalho
COPY . /app/

# Exponha a porta em que o Django irá rodar
EXPOSE 8000

# Comando para rodar o servidor Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
