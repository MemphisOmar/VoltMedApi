# 🏥 VoltMed – API REST Médica con Spring Boot

> **Stack:** Java 17 · Spring Boot 3.3.9 · Spring Security · JWT · MySQL · Flyway · Lombok · SpringDoc OpenAPI

---

## �️ Capturas de Pantalla

> Las siguientes capturas muestran las principales vistas del frontend integrado en la aplicación.

### Login
<!-- Reemplaza la ruta con la imagen real, ej: docs/screenshots/login.png -->
<img width="1913" height="945" alt="image" src="https://github.com/user-attachments/assets/59275da6-7106-440e-9484-ee7e2470a4b7" />




---

### Dashboard
<!-- Panel de control con estadísticas generales -->
![Dashboard – Panel de control](docs/screenshots/dashboard.png)

---

### Gestión de Médicos
<!-- Listado, registro y edición de médicos -->
![Médicos – CRUD completo](docs/screenshots/medicos.png)

---

### Gestión de Pacientes
<!-- Listado, registro y edición de pacientes -->
![Pacientes – CRUD completo](docs/screenshots/pacientes.png)

---

### Consultas
<!-- Reserva y cancelación de consultas médicas -->
![Consultas – Reserva y cancelación](docs/screenshots/consultas.png)

---

> **Nota:** Para agregar tus propias capturas, crea la carpeta `docs/screenshots/` en la raíz del proyecto y reemplaza los archivos de imagen con los nombres indicados arriba.

---

## �🖥️ Demo: Frontend + Backend en Acción

El proyecto incluye un **frontend completo** integrado directamente en el backend Spring Boot (servido desde `src/main/resources/static`). No se necesita servidor adicional — todo corre en `http://localhost:8080`.

### Flujo de la aplicación

```
Usuario → index.html (Login) ──JWT──▶ dashboard.html
                                            │
                          ┌─────────────────┼─────────────────┐
                          ▼                 ▼                  ▼
                    medicos.html      pacientes.html     consultas.html
                    (CRUD Médicos)   (CRUD Pacientes)  (Reservas/Cancelaciones)
```

### Páginas disponibles

| Ruta | Descripción |
|------|-------------|
| `http://localhost:8080/` | Pantalla de login con JWT |
| `http://localhost:8080/dashboard.html` | Panel de control con estadísticas |
| `http://localhost:8080/medicos.html` | Gestión completa de médicos |
| `http://localhost:8080/pacientes.html` | Gestión completa de pacientes |
| `http://localhost:8080/consultas.html` | Reserva y cancelación de consultas |
| `http://localhost:8080/swagger-ui.html` | Documentación interactiva de la API |

### Cómo ejecutar y ver el frontend

```bash
# 1. Configura la base de datos MySQL (nombre: voltmed_ap)
# 2. Levanta el proyecto
./mvnw spring-boot:run

# 3. Abre el navegador en:
# http://localhost:8080
```

> El frontend se comunica con el backend usando `fetch()` con token JWT en el header `Authorization: Bearer <token>`. El archivo `src/main/resources/static/js/api.js` centraliza todas las llamadas HTTP.

### Autenticación en el frontend

1. El usuario ingresa sus credenciales en `index.html`
2. El JS llama a `POST /login` → recibe el `token` JWT
3. El token se guarda en `localStorage` (`voltmed_token`)
4. Cada petición posterior incluye el header `Authorization: Bearer <token>`
5. Si el token expira (2 horas), se redirige automáticamente al login

```javascript
// Ejemplo del helper centralizado (api.js)
const AuthAPI = {
  async login(login, contrasena) {
    const data = await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ login, contrasena })
    });
    Auth.setToken(data.token); // guarda en localStorage
    return data;
  }
};
```

---

## 📋 Tabla de Contenidos

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Tecnologías y Dependencias](#-tecnologías-y-dependencias)
3. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
4. [Base de Datos y Migraciones con Flyway](#-base-de-datos-y-migraciones-con-flyway)
5. [Módulo de Médicos](#-módulo-de-médicos)
6. [Módulo de Pacientes](#-módulo-de-pacientes)
7. [Módulo de Consultas](#-módulo-de-consultas)
8. [Validaciones de Negocio](#-validaciones-de-negocio)
9. [Autenticación y Seguridad JWT](#-autenticación-y-seguridad-jwt)
10. [Manejo de Errores](#-manejo-de-errores)
11. [Documentación con OpenAPI / Swagger](#-documentación-con-openapi--swagger)
12. [Tests Automatizados](#-tests-automatizados)
13. [Configuración por Perfiles](#-configuración-por-perfiles)
14. [Endpoints de la API](#-endpoints-de-la-api)

---

## 📖 Descripción del Proyecto

**VoltMed** es una API REST completa para la **gestión de una clínica médica**. Permite administrar médicos, pacientes y consultas médicas con un sistema de autenticación seguro basado en **JWT (JSON Web Token)**.

El proyecto fue desarrollado siguiendo las mejores prácticas de:
- **Arquitectura en capas** (Controller → Service → Repository)
- **DTOs** (Data Transfer Objects) para separar la capa de presentación del dominio
- **Patrón de validación con Strategy** usando `@Component` e inyección de `List<Validador>`
- **Soft delete** (borrado lógico con campo `activo`)
- **Stateless sessions** (sin estado en el servidor)

---

## 🛠️ Tecnologías y Dependencias

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Java | 17 | Lenguaje principal |
| Spring Boot | 3.3.9 | Framework base |
| Spring Web | ─ | Controladores REST |
| Spring Data JPA | ─ | Persistencia con Hibernate |
| Spring Security | ─ | Seguridad y filtros |
| Spring Validation | ─ | Validación de DTOs con Bean Validation |
| MySQL Connector | ─ | Driver de base de datos |
| Flyway Core + MySQL | ─ | Migraciones de base de datos |
| Auth0 Java JWT | 4.5.0 | Generación/verificación de tokens JWT |
| Lombok | 1.18.28 | Reducción de boilerplate |
| SpringDoc OpenAPI UI | 2.6.0 | Documentación Swagger automática |
| Spring Boot Test | ─ | Pruebas unitarias e integración |
| Spring Security Test | ─ | Pruebas con contexto de seguridad |

---

## 🏗️ Arquitectura del Proyecto

```
src/main/java/med/volt/api/
├── ApiApplication.java              ← Punto de entrada (@SpringBootApplication)
│
├── controller/                      ← Capa de presentación (REST)
│   ├── AuthenticacionController.java
│   ├── MedicoController.java
│   ├── PacienteController.java
│   ├── ConsultaController.java
│   └── HelloController.java
│
├── domain/                          ← Capa de dominio (lógica de negocio)
│   ├── medico/                      ← Entidad + DTOs + Repository
│   ├── paciente/                    ← Entidad + DTOs + Repository
│   ├── consulta/                    ← Entidad + DTOs + Repository + Service
│   │   └── validaciones/            ← Validadores de reglas de negocio
│   ├── usuario/                     ← Entidad + Service de autenticación
│   ├── direccion/                   ← Objeto embebido de dirección
│   └── ValidacionException.java     ← Excepción de dominio personalizada
│
└── infra/                           ← Capa de infraestructura
    ├── security/                    ← JWT + Spring Security
    ├── exceptions/                  ← Manejo global de errores
    └── springdoc/                   ← Configuración de OpenAPI
```

```
src/main/resources/
├── application.properties           ← Configuración base (dev)
├── application-prod.properties      ← Configuración producción (variables de entorno)
├── application-test.properties      ← Configuración de pruebas
├── db/migration/                    ← Scripts SQL de Flyway (V1 a V8)
└── static/                          ← Frontend (HTML/CSS/JS)
    ├── index.html, dashboard.html, medicos.html, pacientes.html, consultas.html
    ├── css/styles.css
    └── js/api.js, nav.js
```

---

## 🗄️ Base de Datos y Migraciones con Flyway

**Flyway** gestiona automáticamente la evolución del esquema de base de datos. Al iniciar la aplicación, ejecuta los scripts SQL en orden ascendente.

| Versión | Archivo | Descripción |
|---------|---------|-------------|
| V1 | `create-table-medicos.sql` | Tabla principal de médicos con dirección embebida |
| V2 | `alter-table-medicos-add-column-telefono.sql` | Agrega columna teléfono a médicos |
| V3 | `alter_table_medicos_activo.sql` | Agrega columna `activo` para soft delete |
| V4 | `create-table-pacientes.sql` | Tabla de pacientes |
| V5 | `alter-table-pacientes-add-column-activo.sql` | Agrega `activo` a pacientes |
| V6 | `CREATE_TABLE_USUARIOS.sql` | Tabla de usuarios para autenticación |
| V7 | `create_table_consultas.sql` | Tabla de consultas médicas con FK |
| V8 | `alter-table-consultas-add-column-motivo-cancelamiento.sql` | Motivo de cancelación |

### Estructura de la tabla `medicos`

```sql
create table medicos (
    id           bigint primary key auto_increment,
    nombre       varchar(100) not null,
    email        varchar(100) not null unique,
    documento    varchar(12)  not null unique,
    especialidad varchar(100) not null,
    activo       tinyint(1),
    telefono     varchar(20),
    -- dirección embebida:
    calle        varchar(100), barrio varchar(100),
    ciudad       varchar(100), estado varchar(100),
    codigo_postal varchar(12), complemento varchar(100), numero varchar(20)
);
```

### Configuración de Flyway (`application.properties`)

```properties
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration
spring.flyway.out-of-order=true
spring.flyway.validate-on-migrate=false
```

---

## 👨‍⚕️ Módulo de Médicos

### Entidad `Medico`

Usa **Lombok** para eliminar getters/constructores repetitivos y **JPA** para el mapeo:

```java
@Entity(name = "Medico")
@Table(name = "medicos")
@Getter @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Medico {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean activo;
    private String nombre;
    private String email;
    private String telefono;
    private String documento;
    @Enumerated(EnumType.STRING)
    private Especialidad especialidad;
    @Embedded
    private Direccion direccion;
}
```

### Especialidades disponibles

```java
public enum Especialidad {
    ORTOPEDIA, CARDIOLOGIA, GINECOLOGIA, PEDIATRIA
}
```

### DTOs del módulo

| DTO | Uso |
|-----|-----|
| `DatosRegistroMedico` | Recibe datos del POST (con `@Valid`) |
| `DatosActualizacionMedico` | Recibe datos del PUT (campos opcionales) |
| `DatosListaMedico` | Proyección para el listado paginado |
| `DatosDetalleMedico` | Respuesta detallada de un médico |

### Soft Delete

El método `eliminar()` en la entidad solo cambia el flag `activo = false`, nunca borra el registro físicamente. El listado filtra con `findAllByActivoTrue()`.

---

## 🧑‍🦯 Módulo de Pacientes

Estructura idéntica al módulo de médicos. Campos: `nombre`, `email`, `documentoIdentidad`, `telefono`, y `Direccion` embebida.

**Operaciones:**
- `POST /pacientes` → Registrar
- `GET /pacientes` → Listar activos (paginado)
- `PUT /pacientes` → Actualizar
- `DELETE /pacientes/{id}` → Soft delete
- `GET /pacientes/{id}` → Detalle

---

## 📅 Módulo de Consultas

### Servicio `ReservaDeConsulta`

El **corazón del negocio**. Orquesta el proceso de reserva:

1. Verifica que el paciente exista
2. Verifica que el médico exista (si se especificó)
3. Ejecuta **todos los validadores** registrados via inyección de `List<ValidadorDeConsultas>`
4. **Elige médico aleatorio** disponible si no se especificó uno
5. Persiste la consulta

```java
@Service
public class ReservaDeConsulta {
    @Autowired
    private List<ValidadorDeConsultas> validadores;

    public DatosDetalleConsulta reservar(DatosReservarConsulta datos) {
        validadores.forEach(v -> v.validar(datos)); // patrón Strategy
        var medico = elegirMedico(datos);
        var consulta = new Consulta(null, medico, paciente, datos.fecha(), null);
        consultaRepository.save(consulta);
        return new DatosDetalleConsulta(consulta);
    }
}
```

### Cancelamiento de Consultas

Se puede cancelar una consulta enviando el `idConsulta` y un `MotivoCancelamiento`:

```java
public enum MotivoCancelamiento {
    PACIENTE_DESISTIO, MEDICO_CANCELO, OTROS
}
```

---

## ✅ Validaciones de Negocio

Se implementó el **patrón Strategy** para las validaciones: cada regla es un `@Component` independiente que implementa la interfaz `ValidadorDeConsultas`. Spring inyecta automáticamente la lista completa.

### Validadores de reserva

| Validador | Regla de negocio |
|-----------|-----------------|
| `ValidacionConsultaAnticipacion` | Mínimo 30 minutos de anticipación |
| `ValidacionFueraHorarioConsultas` | Lunes a Sábado, 07:00–18:00 (sin domingos) |
| `ValidacionMedicoActivo` | El médico debe estar activo |
| `ValidacionPacienteActivo` | El paciente debe estar activo |
| `ValidacionMedicoConOtraConsulta` | El médico no puede tener otra consulta a la misma hora |
| `ValidacionPacienteSinOtraConsulta` | El paciente no puede tener dos consultas el mismo día |

### Validadores de cancelamiento

La carpeta `validaciones/cancelamiento/` contiene validadores del mismo patrón aplicados a la cancelación.

### Interfaz del patrón

```java
public interface ValidadorDeConsultas {
    void validar(DatosReservarConsulta datos);
}
```

> **Ventaja:** Agregar una nueva regla de negocio = crear un nuevo `@Component`. **Sin modificar** código existente (Principio Open/Closed - SOLID).

---

## 🔐 Autenticación y Seguridad JWT

### Flujo completo

```
POST /login
  ↓ DatosAutenticacion { login, contrasena }
  ↓ AuthenticationManager.authenticate()
  ↓ AuthenticacionService.loadUserByUsername()
  ↓ BCrypt verifica contraseña
  ↓ TokenService.generarToken()
  ↓ Retorna { "token": "eyJhbGc..." }
```

### `TokenService` – Generación de JWT

- **Algoritmo:** HMAC256
- **Issuer:** `"API Voll.med"`
- **Expiración:** 2 horas (7200 segundos)
- **Secret:** inyectado desde `${api.security.token.secret}`

```java
return JWT.create()
    .withIssuer("API Voll.med")
    .withSubject(usuario.getLogin())
    .withExpiresAt(Instant.now().plusSeconds(7200))
    .sign(Algorithm.HMAC256(secret));
```

### `SecurityFilter` – Validación por request

Intercepta cada petición, extrae el token del header `Authorization: Bearer <token>`, lo valida y establece el contexto de seguridad (`SecurityContextHolder`).

### `SecurityConfigurations` – Reglas de acceso

```java
.authorizeHttpRequests(req -> {
    req.requestMatchers(HttpMethod.POST, "/login").permitAll();  // login libre
    req.requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll(); // Swagger libre
    req.requestMatchers("/", "/index.html", "/dashboard.html", ...).permitAll(); // Frontend libre
    req.anyRequest().authenticated(); // todo lo demás requiere JWT
})
```

- **Sin estado (Stateless):** no hay sesiones HTTP, solo JWT
- **CSRF deshabilitado:** innecesario en APIs REST stateless
- **CORS configurado:** permite todos los orígenes con credenciales
- **BCrypt:** para el hash de contraseñas

---

## ⚠️ Manejo de Errores

`GestorDeErrores` (anotado con `@RestControllerAdvice`) centraliza el manejo de excepciones y devuelve respuestas HTTP apropiadas:

| Excepción | HTTP Response |
|-----------|--------------|
| `EntityNotFoundException` | `404 Not Found` |
| `MethodArgumentNotValidException` | `400 Bad Request` + lista de campos inválidos |
| `ValidacionException` (dominio) | `400 Bad Request` + mensaje descriptivo |
| `AccessDeniedException` | `403 Forbidden` |

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Object> gestionarError400(MethodArgumentNotValidException ex) {
    var errores = ex.getFieldErrors();
    return ResponseEntity.badRequest()
        .body(errores.stream().map(DatosErrorValidacion::new).toList());
}
```

También se configuró en `application.properties`:
```properties
server.error.include-stacktrace=never  # no exponer stack traces al cliente
```

---

## 📚 Documentación con OpenAPI / Swagger

Integrado con **SpringDoc OpenAPI 2.6.0**. Accesible en:

```
http://localhost:8080/swagger-ui.html
http://localhost:8080/v3/api-docs
```

Todos los endpoints protegidos están anotados con `@SecurityRequirement(name = "bearer-key")`, lo que permite autenticarse directamente en la UI de Swagger con el token JWT.

La configuración en `SpringDocConfig.java` registra el esquema de seguridad `bearer-key` globalmente para toda la API.

---

## 🧪 Tests Automatizados

### `ConsultaControllerTest` – Test de capa web

Usa `@SpringBootTest` + `@AutoConfigureMockMvc` para probar el controller HTTP completo:

```java
@Test
@DisplayName("Deberia devolver http 400 cuando la request no tenga datos")
@WithMockUser
void reservar_escenario1() throws Exception {
    var response = mvc.perform(post("/consultas")).andReturn().getResponse();
    assertThat(response.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
}
```

- **`@MockBean`** para `ReservaDeConsulta` → aísla la lógica de negocio
- **`@WithMockUser`** → simula un usuario autenticado en el contexto de seguridad
- **`JacksonTester`** → serialización/deserialización de JSON en tests

### `MedicoRepositoryTest` – Test de repositorio

Usa `@DataJpaTest` para probar queries personalizadas:

```java
@Test
@DisplayName("Deberia devolver null cuando el medico existe pero no está disponible en esa fecha")
void elegirMedicoAleatorioDisponibleEnLaFechaEscenario1() {
    // given: médico con consulta ya asignada
    // when: buscar médico disponible en esa fecha
    // then: debe retornar null
    assertThat(medicoLibre).isNull();
}
```

- **`@DataJpaTest`** → solo carga el contexto JPA (más rápido)
- **`@AutoConfigureTestDatabase(replace = NONE)`** → usa la BD real (MySQL de test)
- **`@ActiveProfiles("test")`** → activa `application-test.properties`
- Patrón **Given / When / Then** (AAA: Arrange, Act, Assert)

---

## ⚙️ Configuración por Perfiles

### `application.properties` (desarrollo)

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/voltmed_ap
spring.datasource.username=root
spring.datasource.password=***
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
api.security.token.secret=${JWT_SECRET:12345678}
```

### `application-prod.properties` (producción)

```properties
spring.datasource.url=${DATASOURCE_URL}
spring.datasource.username=${DATASOURCE_USERNAME}
spring.datasource.password=${DATASOURCE_PASSWORD}
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false
```

> En producción **nunca** se hardcodean credenciales; se leen de variables de entorno.

### `application-test.properties` (pruebas)

Apunta a una base de datos separada para no afectar datos de desarrollo.

---

## 🔗 Endpoints de la API

Todos los endpoints (excepto `/login`) requieren el header:
```
Authorization: Bearer <token_jwt>
```

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/login` | Obtener token JWT | ❌ |

### Médicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/medicos` | Registrar nuevo médico |
| GET | `/medicos` | Listar médicos activos (paginado, orden por nombre) |
| GET | `/medicos/{id}` | Detalle de un médico |
| PUT | `/medicos` | Actualizar médico (id en el body) |
| DELETE | `/medicos/{id}` | Desactivar médico (soft delete) |

### Pacientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/pacientes` | Registrar nuevo paciente |
| GET | `/pacientes` | Listar pacientes activos (paginado) |
| GET | `/pacientes/{id}` | Detalle de un paciente |
| PUT | `/pacientes` | Actualizar paciente |
| DELETE | `/pacientes/{id}` | Desactivar paciente (soft delete) |

### Consultas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/consultas` | Reservar consulta (médico aleatorio si no se especifica) |
| DELETE | `/consultas` | Cancelar consulta (motivo en el body) |

### Ejemplo de request – Reservar consulta

```json
POST /consultas
{
  "idPaciente": 1,
  "idMedico": null,
  "especialidad": "CARDIOLOGIA",
  "fecha": "2026-03-15T10:00:00"
}
```

### Ejemplo de respuesta

```json
{
  "id": 42,
  "idMedico": 3,
  "idPaciente": 1,
  "fecha": "2026-03-15T10:00:00"
}
```

---

## 🚀 Cómo ejecutar el proyecto

### Prerrequisitos

- Java 17+
- MySQL 8+
- Maven (o usar `./mvnw`)

### Pasos

```bash
# 1. Crear la base de datos
mysql -u root -p -e "CREATE DATABASE voltmed_ap;"

# 2. Clonar y entrar al proyecto
cd api

# 3. Ejecutar (Flyway crea las tablas automáticamente)
./mvnw spring-boot:run

# 4. Acceder al frontend
open http://localhost:8080

# 5. Swagger UI
open http://localhost:8080/swagger-ui.html
```

### Ejecutar tests

```bash
./mvnw test
```

### Generar JAR para producción

```bash
./mvnw clean package -P prod

java -jar target/api-0.0.1-SNAPSHOT.jar \
  --DATASOURCE_URL=jdbc:mysql://host:3306/db \
  --DATASOURCE_USERNAME=user \
  --DATASOURCE_PASSWORD=pass \
  --JWT_SECRET=mi_secret_seguro
```

---

## 📐 Conceptos Clave Aprendidos en el Curso

| Concepto | Dónde se aplica |
|----------|----------------|
| **REST con Spring Boot** | Todos los controllers |
| **DTOs / Records** | `DatosRegistroMedico`, `DatosDetalleMedico`, etc. |
| **Bean Validation** | `@Valid`, `@NotNull`, `@NotBlank`, `@Future` |
| **Paginación** | `Pageable`, `Page<T>`, `@PageableDefault` |
| **Spring Data JPA** | Repositories, queries derivadas, `@Query` |
| **Soft Delete** | Campo `activo`, método `eliminar()` |
| **Patrón Strategy** | `ValidadorDeConsultas` + `List<>` inyectado |
| **JWT Stateless** | `TokenService`, `SecurityFilter` |
| **Spring Security** | `SecurityFilterChain`, `BCryptPasswordEncoder` |
| **Flyway Migrations** | Scripts V1–V8 |
| **Perfiles de Spring** | dev / test / prod |
| **@RestControllerAdvice** | `GestorDeErrores` |
| **OpenAPI / Swagger** | `springdoc-openapi-starter-webmvc-ui` |
| **Tests con MockMvc** | `ConsultaControllerTest` |
| **Tests de Repository** | `MedicoRepositoryTest` con `@DataJpaTest` |
| **CORS** | `CorsConfigurationSource` en Security |
| **Variables de entorno** | `application-prod.properties` |

---

*Proyecto desarrollado como parte del curso de Spring Boot con Java — API REST completa con buenas prácticas.*
