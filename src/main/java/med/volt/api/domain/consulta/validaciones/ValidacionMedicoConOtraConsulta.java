package med.volt.api.domain.consulta.validaciones;

import med.volt.api.domain.ValidacionException;
import med.volt.api.domain.consulta.ConsultaRepository;
import med.volt.api.domain.consulta.DatosReservarConsulta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidacionMedicoConOtraConsulta implements ValidadorDeConsultas {
    @Autowired
    private ConsultaRepository repository;

    public void validar(DatosReservarConsulta datos) {
        var medicoTieneOtraConsulta = repository.existsByMedicoIdAndFechaAndMotivoCancelamientoIsNull(datos.idMedico(), datos.fecha());
        if (medicoTieneOtraConsulta) {
            throw new ValidacionException("El médico ya tiene una consulta programada para ese día");
        }
    }
}
