# Use a imagem oficial do Nginx como base
FROM nginx

# Copie o arquivo HTML para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Exponha a porta 80 (a porta padrão do Nginx)
EXPOSE 80

# Comando para rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]
