# Usamos la imagen oficial de Node.js basada en Alpine Linux por su ligereza
# node22 compativble con Angular 22
FROM node:22-alpine

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto del código fuente de la aplicación al contenedor
COPY . .

# Exponemos el puerto estándar en el que corre el servidor de desarrollo de Angular
EXPOSE 4200

# Comando para arrancar la aplicación permitiendo conexiones externas y polling para sincronizar cambios
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll=2000"]