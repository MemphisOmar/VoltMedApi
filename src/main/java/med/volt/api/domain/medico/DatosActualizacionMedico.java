package med.volt.api.domain.medico;

import jakarta.validation.constraints.NotNull;
import med.volt.api.domain.direccion.DatosDireccion;

public record DatosActualizacionMedico(
        @NotNull Long id,
        String nombre,
        String telefono,
        DatosDireccion direccion
)
{
}
