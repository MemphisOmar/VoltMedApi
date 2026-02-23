create table usuarios(
    id bigint not null auto_increment,
    login varchar(100) not null,
    contrasena varchar(255) not null,package med.volt.api.domain.consulta;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DatosReservarConsulta(
    Long idMedico,
    @NotNull Long idPaciente,
    @NotNull @Future LocalDateTime fecha
) {}
    primary key (id)
);