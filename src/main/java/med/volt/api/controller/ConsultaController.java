package med.volt.api.controller;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import med.volt.api.domain.consulta.DatosCancelamientoConsulta;
import med.volt.api.domain.consulta.DatosDetalleConsulta;
import med.volt.api.domain.consulta.DatosReservarConsulta;
import med.volt.api.domain.consulta.ReservaDeConsulta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/consultas")
@SecurityRequirement(name = "bearer-key")
public class ConsultaController {

    @Autowired
    private ReservaDeConsulta reserva;


    @PostMapping
    @Transactional
    public ResponseEntity<DatosDetalleConsulta> reservar(@RequestBody @Valid DatosReservarConsulta datos) {
        System.out.println(datos);

        var detalleConsulta = reserva.reservar(datos);

        return ResponseEntity.ok(detalleConsulta);
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<Void> cancelar(@RequestBody @Valid DatosCancelamientoConsulta datos) {
        reserva.cancelar(datos);
        return ResponseEntity.noContent().build();
    }
}
