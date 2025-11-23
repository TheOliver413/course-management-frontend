# Setup Completo del Proyecto

Esta guía te ayudará a configurar y ejecutar todo el proyecto de gestión de cursos.

## Estructura del Proyecto

```
proyecto-root/
├── backend/     # API Node.js + Express
├── frontend/    # Frontend Next.js
├── .gitignore
└── README.md
```

## Paso 1: Configurar PostgreSQL

### Windows
1. Descarga PostgreSQL desde https://www.postgresql.org/download/windows/
2. Instala con usuario `postgres` y contraseña que recuerdes
3. Durante la instalación, anota el puerto (por defecto 5432)

### Mac
```bash
brew install postgresql
brew services start postgresql
```

### Linux
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Crear la Base de Datos

```bash
psql -U postgres

# En la consola psql:
CREATE DATABASE course_db;
\q
```

## Paso 2: Configurar el Backend

```bash
cd backend

# Crear archivo .env
cp .env.example .env

# Editar .env con tus valores
# DATABASE_URL=postgresql://postgres:tu_contraseña@localhost:5432/course_db

# Instalar dependencias
npm install

# Ejecutar migraciones
npm run migrate

# Cargar datos de prueba
npm run seed

# Verificar conexión
npm run test:connection

# Iniciar servidor
npm run dev
```

El backend estará disponible en `http://localhost:5000`

### Verificar que Backend está Funcionando

Visita en el navegador:
- GraphQL: http://localhost:5000/graphql
- Health Check: http://localhost:5000 (debería devolver JSON)

## Paso 3: Configurar el Frontend

```bash
cd frontend

# Crear archivo .env.local
cp .env.example .env.local

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## Paso 4: Prueba la Aplicación

### Login

1. Abre http://localhost:3000
2. Serás redirigido a `/auth/login`
3. Ingresa credenciales:
   - Email: `admin@coursesystem.com`
   - Password: `Admin@123456`

### Como Admin

- Accede a "Manage Courses" para crear, editar y eliminar cursos
- Accede a "Manage Users" para ver todos los usuarios
- Puedes navegar a "Browse Courses" como un usuario normal

### Como Usuario Regular

Crea una nueva cuenta o usa:
- Email: `user1@example.com`
- Password: `User@123456`

## Estructura de Archivos Importante

### Backend
```
backend/
├── src/
│   ├── index.js              # Archivo principal
│   ├── db/
│   │   ├── connection.js     # Configuración de PostgreSQL
│   │   └── schema.sql        # Esquema de base de datos
│   ├── models/
│   │   ├── User.model.js
│   │   └── Program.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── program.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   └── error.middleware.js
│   ├── graphql/
│   │   └── schema.js
│   └── scripts/
│       ├── migrate.js        # Crear tablas
│       ├── seed.js           # Insertar datos iniciales
│       └── drop.js           # Limpiar base de datos
├── package.json
├── .env
└── .env.example
```

### Frontend
```
frontend/
├── app/
│   ├── (auth)/               # Rutas públicas
│   ├── (protected)/          # Rutas privadas
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── admin/
│   ├── layout/
│   ├── theme-provider.tsx
│   └── ui/
├── hooks/
│   ├── useAuth.ts
│   ├── useProtectedRoute.ts
│   └── use-toast.ts
├── lib/
│   ├── api-client.ts
│   └── utils.ts
├── package.json
└── .env.local
```

## Comandos Útiles

### Backend

```bash
cd backend

# Desarrollo
npm run dev

# Producción
npm run build
npm start

# Testing
npm test
npm run test:coverage

# Base de datos
npm run migrate      # Crear tablas
npm run seed         # Insertar datos de prueba
npm run drop         # Limpiar base de datos

# Verificación
npm run test:connection  # Probar conexión a DB
```

### Frontend

```bash
cd frontend

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Linting
npm run lint
```

## Variables de Entorno

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/course_db
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRY=24h
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
ADMIN_EMAIL=admin@coursesystem.com
ADMIN_PASSWORD=Admin@123456
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Troubleshooting

### Error: Cannot connect to database

1. Verifica que PostgreSQL esté corriendo
2. Verifica que la base de datos `course_db` existe
3. Verifica las credenciales en `DATABASE_URL`
4. Ejecuta: `npm run test:connection`

### Error: Port 5000 already in use

```bash
# Cambiar puerto en backend/.env
PORT=5001
```

### Error: CORS error

1. Verifica que `CORS_ORIGIN` en backend sea igual a `NEXT_PUBLIC_API_URL` en frontend
2. Reinicia ambos servidores

### Error: Token inválido o expirado

1. Limpia localStorage: `localStorage.clear()`
2. Vuelve a hacer login
3. Verifica que `JWT_SECRET` sea el mismo en ambas sesiones

## Despliegue

### Opción 1: Railway

1. Conecta tu repositorio de GitHub
2. Configura variables de entorno
3. Deploy automático en cada push

### Opción 2: Vercel (Frontend)

1. Conecta tu repositorio
2. Especifica carpeta: `frontend/`
3. Deploy automático

### Opción 3: Heroku (Backend)

1. Crea una aplicación
2. Conecta base de datos PostgreSQL
3. Configura variables de entorno
4. Deploy desde GitHub

## Próximos Pasos

1. Familiarízate con la estructura del proyecto
2. Revisa la API: http://localhost:5000/graphql
3. Intenta crear un curso como admin
4. Inscríbete en un curso como usuario regular
5. Explora el código y experimenta

## Soporte

Para problemas específicos:
1. Revisa los logs en backend: `npm run dev` mostrará errores
2. Abre la consola del navegador (F12) en frontend
3. Verifica que todos los archivos .env estén configurados correctamente

¡Bienvenido al proyecto!
