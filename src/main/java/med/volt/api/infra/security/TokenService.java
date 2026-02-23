package med.volt.api.infra.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import med.volt.api.domain.usuario.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String generarToken(Usuario usuario) {
        try {
            var algoritmo = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("API Voll.med")
                    .withSubject(usuario.getLogin())
                    .withExpiresAt(fechaExpiracion())
                    .sign(algoritmo);
        } catch (JWTCreationException exception){
            throw new RuntimeException("error al generar el token JWT", exception);
        }
    }

    private Instant fechaExpiracion() {
        return Instant.now().plusSeconds(7200); // 2 horas = 7200 segundos
    }

    public String getSubject(String tokenJWT) {
        if (tokenJWT == null || tokenJWT.trim().isEmpty()) {
            throw new RuntimeException("Token JWT es nulo o vacío");
        }
        try {
            var algoritmo = Algorithm.HMAC256(secret);
            return JWT.require(algoritmo)
                    .withIssuer("API Voll.med")
                    .build()
                    .verify(tokenJWT.trim())
                    .getSubject();
        } catch (JWTVerificationException exception){
            // Mensaje más específico según el tipo de error
            if (exception.getMessage().contains("expired")) {
                System.err.println("Token JWT expirado: " + exception.getMessage());
                throw new RuntimeException("Token JWT expirado. Por favor, inicie sesión nuevamente.", exception);
            } else {
                System.err.println("Error al verificar token: " + exception.getMessage());
                throw new RuntimeException("Token JWT inválido!", exception);
            }
        }
    }
}

