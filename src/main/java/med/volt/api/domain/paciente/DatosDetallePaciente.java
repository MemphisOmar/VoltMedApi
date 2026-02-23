package med.volt.api.domain.paciente;

import med.volt.api.domain.direccion.Direccion;


import med.volt.api.domain.direccion.*;

public record DatosDetallePaciente(Long id,
                                 String nombre,
                                 String telefono,
                                 String email,
                                 String documento_identidad,
                                 Direccion direccion) {
    public DatosDetallePaciente(Paciente paciente) {
        this(paciente.getId(),
                paciente.getNombre(),
                paciente.getTelefono(),
                paciente.getEmail(),
                paciente.getDocumento_identidad(),
                paciente.getDireccion());
    }
}
