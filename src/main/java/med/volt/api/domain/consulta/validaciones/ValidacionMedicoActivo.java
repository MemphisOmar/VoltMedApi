package med.volt.api.domain.consulta.validaciones;

import med.volt.api.domain.consulta.DatosReservarConsulta;
import med.volt.api.domain.medico.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidacionMedicoActivo implements ValidadorDeConsultas {
    @Autowired

    private MedicoRepository repository;

    public void validar(DatosReservarConsulta datos){
        if (datos.idMedico() == null) {
            return;
        }
        var medicoActivo = repository.findActivoById(datos.idMedico());
        if (!medicoActivo) {
            throw new RuntimeException("El médico no está activo");
        }
    }
}
