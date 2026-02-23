package med.volt.api.domain.medico;

import med.volt.api.domain.direccion.*;
import med.volt.api.domain.direccion.Direccion;

public record DatosDetalleMedico(Long id,
                                 String nombre,
                                 String telefono,
                                 String email,
                                 String documento,
                                 Especialidad especialidad,
                                 Direccion direccion) {
    public DatosDetalleMedico(Medico medico) {
        this(medico.getId(), medico.getNombre(), medico.getTelefono(), medico.getEmail(), medico.getDocumento(),
                medico.getEspecialidad(), medico.getDireccion());
    }
}
