

**Carrera**: Tecnicatura Universitaria en Programación

**Cátedra**: Programación IV

**Comisión**: Avellaneda

**Profesor/a**: Malfasi Federico

**Alumnos:** Aramburú-Lebus Santiago, Buseghin Augustín, Martinez Nestor, Tomadín Tobías, Vega Paula

**Fecha de entrega**: Martes 4 de Noviembre

**Año:** 2025  
 

**💻 Documentación del API Backend**

El API se estructura en dos secciones principales: **Rutas de Usuario (autenticación)** y **Rutas de Productos** (protegidas por **JWT**). La implementación se basa en **Node.js/Express** y utiliza **Sequelize** como ORM. La seguridad de la contraseña se maneja con **Bcrypt**, y la autorización se gestiona mediante **JSON Web Tokens (JWT)**.

**Base URL:** http://localhost:3001

## **1\. Rutas de Usuario (Auth)**

Estos *endpoints* manejan el ciclo de vida del usuario (registro, inicio de sesión) y son cruciales para obtener el **JWT** necesario para acceder a los recursos protegidos. Rutas montadas en la raíz (/).

### **1.1. Registro de Usuario**

Crea un nuevo usuario en el sistema. Es obligatorio que la contraseña y su confirmación coincidan para evitar errores de tipeo y garantizar un *hash* correcto en la base de datos.

* **URL:** /  
* **Method:** POST

### **Body:**

* **Formato:** JSON

| Campo Requerido | Tipo | Descripción |
| :---- | :---- | :---- |
| fullName | string | Nombre completo del usuario. |
| **email** | string | Correo electrónico, debe ser **único**. |
| password | string | Contraseña que será *hasheada* con Bcrypt. |
| confirmPassword | string | Confirmación de la contraseña. |

### **Return (Respuesta Éxito \- 200 OK):**

* **Formato:** JSON

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| error | boolean | false. |
| msg | string | Mensaje de confirmación: "Usuario creado". |

{  
  "error": false,  
  "msg": "Usuario creado"  
}

### **Ejemplo de Uso (cURL Request):**

curl \--request POST \\  
  \--url 'http://localhost:3001/' \\  
  \--header 'Content-Type: application/json' \\  
  \--data '{  
    "fullName": "Juan Perez",  
    "email": "juan.perez@example.com",  
    "password": "mySecurePassword123",  
    "confirmPassword": "mySecurePassword123"  
}'

### **Respuestas de Error:**

**RESPONSE (Error \- 403 Forbidden \- Contraseñas no coinciden):**

{  
  "error": true,  
  "msg": "Las contraseñas no coinciden"  
}

**Nota de Error:** Si se intenta registrar un email ya existente, el servidor devolverá un código **400 Bad Request** con un mensaje de error de validación, ya que el campo **email** está marcado como único en el modelo.

## **1.2. Iniciar Sesión**

Autentica al usuario y devuelve el **JSON Web Token (JWT)** necesario para las rutas protegidas.

* **URL:** /login  
* **Method:** POST

### **Body:**

* **Formato:** JSON

| Campo Requerido | Tipo | Descripción |
| :---- | :---- | :---- |
| email | string | Correo electrónico del usuario. |
| password | string | Contraseña (sin hashear). |

### **Return (Respuesta Éxito \- 200 OK):**

* **Formato:** JSON  
* **Campos Clave:** El campo user.token contiene el **JWT** (prefijado con 'Bearer '). Usar en el *header* Authorization.

{  
  "error": false,  
  "user": {  
    "full\_name": "Juan Perez",  
    "email": "juan.perez@example.com",  
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.XYZ..."  
  }  
}

### **Ejemplo de Uso (cURL Request):**

curl \--request POST \\  
  \--url 'http://localhost:3001/login' \\  
  \--header 'Content-Type: application/json' \\  
  \--data '{  
    "email": "juan.perez@example.com",  
    "password": "mySecurePassword123"  
}'

### **Respuestas de Error Comunes:**

| Código | Cuerpo de Respuesta | Descripción |
| :---- | :---- | :---- |
| **404 Not Found** | {"error": true, "msg": "El usuario no existe"} | Email no encontrado. |
| **403 Forbidden** | {"error": true, "msg": "Password incorrecto"} | Contraseña ingresada incorrecta. |

## **1.3. Verificar Token**

Comprueba la validez, integridad y expiración de un token JWT.

* **URL:** /verify-token  
* **Method:** GET  
* **Protección:** Requiere **Header Authorization**

### **Headers:**

| Campo | Valor | Descripción |
| :---- | :---- | :---- |
| Authorization | Bearer \<TU\_JWT\_TOKEN\> | **Requerido** para acceder a la ruta. |

### **Return (Respuesta Éxito \- 200 OK):**

{  
  "error": false,  
  "email": "juan.perez@example.com"  
}

### **Respuestas de Error Comunes:**

| Código | Cuerpo de Respuesta | Descripción |
| :---- | :---- | :---- |
| **401 Unauthorized** | {"error": true, "msg": "Token inválido o expirado"} | El JWT no es válido, ha expirado, o está mal formado. |

## **2\. Rutas de Productos**

Montadas bajo /products. Implementan el **CRUD** (Crear, Leer, Actualizar, Eliminar) de productos.

🔒 **Protección JWT:** Todos los *endpoints* en esta sección **requieren** el *header* Authorization: Bearer \<TU\_JWT\_TOKEN\_VALIDO\>.

### **2.1. Obtener Todos los Productos**

Devuelve una lista completa de todos los productos en la base de datos.

* **URL:** /products  
* **Method:** GET  
* **Protección:** JWT Requerido

### **Return (Respuesta Éxito \- 200 OK):**

* **Formato:** JSON

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| data | Product\[\] | Arreglo de objetos producto. |

{  
  "error": false,  
  "data": \[  
    {  
      "id": 1,  
      "name": "Laptop Pro",  
      "price": 1200.50,  
      "stock": 50,  
      "createdAt": "2023-11-03T07:00:00.000Z",  
      "updatedAt": "2023-11-03T07:00:00.000Z"  
    }  
  \]  
}

### **2.2. Crear un Nuevo Producto**

Agrega un nuevo producto a la base de datos.

* **URL:** /products  
* **Method:** POST  
* **Protección:** JWT Requerido

### **Body:**

| Campo Requerido | Tipo | Descripción |
| :---- | :---- | :---- |
| name | string | Nombre del producto. |
| price | float | Precio de venta. |
| stock | integer | Cantidad inicial en inventario. |

### **Return (Respuesta Éxito \- 200 OK):**

{  
  "error": false,  
  "msg": "Producto cargado"  
}

### **2.3. Obtener Producto por ID**

Busca y devuelve los detalles de un producto específico.

* **URL:** /products/product?id=...  
* **Method:** GET  
* **Parámetro:** id (Requerido) \- El ID del producto a buscar.  
* **Protección:** JWT Requerido

### **Return (Respuesta Éxito \- 200 OK):**

{  
  "error": false,  
  "product": {  
    "id": 1,  
    "name": "Laptop Pro",  
    "price": 1200.50,  
    "stock": 50,  
    // ... otros campos  
  }  
}

### **Respuesta de Error Común:**

| Código | Cuerpo de Respuesta | Descripción |
| :---- | :---- | :---- |
| **404 Not Found** | {"error": true, "msg": "Producto no encontrado"} | El ID de producto no existe. |

### **2.4. Actualizar Producto por ID**

Realiza una actualización completa del registro de un producto.

* **URL:** /products?id=...  
* **Method:** PUT  
* **Parámetro:** id (Requerido) \- ID del producto a actualizar.  
* **Protección:** JWT Requerido

### **Body:**

| Campo Requerido | Tipo | Descripción |
| :---- | :---- | :---- |
| name | string | Nuevo nombre. |
| price | float | Nuevo precio. |
| stock | integer | Nuevo stock. |

### **Return (Respuesta Éxito \- 200 OK):**

{  
  "error": false,  
  "msg": "Producto actualizado"  
}

### **Respuesta de Error Común:**

| Código | Cuerpo de Respuesta | Descripción |
| :---- | :---- | :---- |
| **404 Not Found** | {"error": true, "msg": "No se puede actualizar, porque no existe"} | El ID de producto no existe. |

### **2.5. Eliminar Producto por ID**

Elimina permanentemente un producto de la base de datos.

* **URL:** /products?id=...  
* **Method:** DELETE  
* **Parámetro:** id (Requerido) \- ID del producto a eliminar.  
* **Protección:** JWT Requerido

### **Return (Respuesta Éxito \- 200 OK):**

{  
  "error": false,  
  "msg": "Producto eliminado"  
}

## **2.6. Lógica de Seguridad y Autorización (Backend)**

Este apartado detalla la implementación de seguridad en las rutas del CRUD de productos, específicamente en el archivo product.mjs.

### **Rutas Públicas (Lectura sin Autenticación)**

* **Endpoints:** GET /products (todos) y GET /products/product?id=... (por ID).  
* **Autenticación:** **NO** requieren autenticación (no utilizan el authMiddleware).  
* **Práctica de Seguridad:** Las consultas a la base de datos que incluyen referencias al usuario (JOINs) utilizan explícitamente attributes: \['id', 'fullName', 'email'\] en la consulta include. Esto previene que datos sensibles del usuario (como *hash* de contraseña o *activateToken*) sean accidentalmente filtrados a través de *endpoints* públicos.

### **Rutas Privadas (Escritura/Modificación con Autenticación)**

* **Endpoints:** POST /products (Creación), PUT /products?id=... (Actualización), y DELETE /products?id=... (Eliminación).  
* **Autenticación:** Todas estas rutas están protegidas por el *middleware* de autenticación (authMiddleware), el cual valida el JWT y adjunta la identidad del usuario en **req.user**.

#### **Control de Propiedad (Autorización a Nivel de Objeto)**

1. **Creación (POST /products):**  
   * La propiedad del producto se asigna de forma segura usando **userId: req.user.id**.  
   * El ID del propietario se toma **siempre** del token de sesión verificado (req.user.id), **nunca** del cuerpo de la solicitud (req.body). Esto es fundamental para prevenir la suplantación de identidad al crear ítems.  
2. **Actualización (PUT /products) y Eliminación (DELETE /products):**  
   * Implementan un estricto control de acceso a nivel de objeto. **No basta con estar autenticado.**  
   * **Verificación:** El sistema busca el producto por ID (Product.findByPk(req.params.id)) y verifica explícitamente la propiedad: if (product.userId \!== req.user.id).  
   * **Resultado:** Si la comprobación falla (el usuario autenticado no es el dueño), se devuelve una respuesta **403 Forbidden (No autorizado)**. Si pasa, se ejecuta la acción (.save() o .destroy()).

## **3\. Lógica de Autorización en el Frontend (UX)**

La aplicación de frontend implementa una **doble verificación** de seguridad para optimizar la experiencia de usuario (UX) al evitar mostrar acciones que no están permitidas.

### **Componente ProductRow.jsx**

* **Lógica de UI:** El componente determina si el usuario actual es el propietario del producto usando la lógica const isOwner \= user?.id \=== data.userId.  
* **Renderizado Condicional:** Los botones de acción (**"Editar"** y **"Eliminar"**) solo se renderizan y muestran en la interfaz si isOwner es verdadero.

**Importante (Doble Verificación):**

La seguridad **real** reside exclusivamente en el **Backend (API)**. El frontend solo oculta botones para el usuario honesto. Si un usuario intenta forzar una petición no autorizada (ej. modificando el DOM o usando una herramienta de terceros), el Backend la rechazará de manera segura con un **403 Forbidden**, independientemente de lo que muestre la interfaz de usuario.

