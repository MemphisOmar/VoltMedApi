package med.volt.api.domain.consulta.validaciones;

import med.volt.api.domain.ValidacionException;
import med.volt.api.domain.consulta.ConsultaRepository;
import med.volt.api.domain.consulta.DatosReservarConsulta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
@Component



public class ValidacionConsultaAnticipacion implements ValidadorDeConsultas {
    @Autowired
    private ConsultaRepository repository;
    public void validar(DatosReservarConsulta datos) {
            var ahora = LocalDateTime.now();
            var fechaConsulta = datos.fecha();
            var diferenciaEnMinutos = Duration.between(ahora, fechaConsulta).toMinutes();
            if (diferenciaEnMinutos < 30) {
                throw new ValidacionException("La consulta debe reservarse con al menos 30 minutos de anticipación.");
            }
    }
}
