package med.volt.api.domain.consulta.validaciones;

import med.volt.api.domain.ValidacionException;
import med.volt.api.domain.consulta.DatosReservarConsulta;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
@Component
public class ValidacionFueraHorarioConsultas implements ValidadorDeConsultas {

    public void validar(DatosReservarConsulta datos) {
        var fechaConsulta = datos.fecha();
        var domingo = fechaConsulta.getDayOfWeek().equals(DayOfWeek.SUNDAY);
        var horarioAntesDeApertura = fechaConsulta.getHour() < 7;
        var horarioDespuesDeCierre = fechaConsulta.getHour() > 18;
        if(domingo || horarioAntesDeApertura || horarioDespuesDeCierre){
            throw new ValidacionException("Horario Seleccionado fuera del horario de atención.");
        }

    }
}
