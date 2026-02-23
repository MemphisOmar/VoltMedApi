package med.volt.api.domain.consulta.validaciones;

import med.volt.api.domain.consulta.ConsultaRepository;
import med.volt.api.domain.consulta.DatosReservarConsulta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidacionPacienteSinOtraConsulta implements ValidadorDeConsultas{
    @Autowired
    private ConsultaRepository repository;

    public void validar(DatosReservarConsulta datos) {
        var primerHorario = datos.fecha().withHour(7);
        var ultimoHorario = datos.fecha().withHour(18);
        var pacienteTieneOtraConsulta = repository.existsByPacienteIdAndFechaBetween(datos.idPaciente(), primerHorario, ultimoHorario);
        if (pacienteTieneOtraConsulta) {
            throw new RuntimeException("El paciente ya tiene una consulta programada para ese día");

        }
    }
}
