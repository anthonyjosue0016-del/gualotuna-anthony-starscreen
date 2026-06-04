CREATE USER cine_user WITH PASSWORD 'admin123';
CREATE DATABASE cine_db OWNER cine_user;

ALTER SCHEMA public OWNER TO cine_user;
GRANT ALL ON SCHEMA public TO cine_user;
GRANT CREATE ON SCHEMA public TO cine_user;

ALTER DEFAULT PRIVILEGES FOR USER cine_user IN SCHEMA public
GRANT ALL ON TABLES TO cine_user;

ALTER DEFAULT PRIVILEGES FOR USER cine_user IN SCHEMA public
GRANT ALL ON SEQUENCES TO cine_user;

ALTER DEFAULT PRIVILEGES FOR USER cine_user IN SCHEMA public
GRANT ALL ON FUNCTIONS TO cine_user;


npm install -g @nestjs/cli
nest new gualotuna-starscreen-api



nest generate module categories    / planes
nest generate controller categories    / planes
nest generate service categories    / planes

nest generate module peliculas    / socios
nest generate controller peliculas    / socios
nest generate service peliculas    / socios

nest generate module entradas    / services
nest generate controller entradas    / services
nest generate service entradas    / services