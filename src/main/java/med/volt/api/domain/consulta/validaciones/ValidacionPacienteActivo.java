package med.volt.api.domain.consulta.validaciones;

import med.volt.api.domain.ValidacionException;
import med.volt.api.domain.consulta.DatosReservarConsulta;
import med.volt.api.domain.paciente.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidacionPacienteActivo implements ValidadorDeConsultas{
    @Autowired

    private PacienteRepository repository;

    public void validar(DatosReservarConsulta datos){
        var pacienteActivo = repository.findActivoById(datos.idPaciente());
        if(!pacienteActivo){
            throw new ValidacionException("El paciente no está activo");
        }
    }
}
