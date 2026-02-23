package med.volt.api.domain.medico;
import jakarta.validation.Valid;
import med.volt.api.domain.direccion.Direccion;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Table (name = "medicos")
@Entity (name = "Medico")


public class Medico{
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean activo;
    private String nombre;
    private String email;
    private String telefono;
    private String documento;
    @Enumerated (EnumType.STRING)
    private Especialidad especialidad;
    @Embedded
    Direccion direccion;

    public Medico(DatosRegistroMedico datos) {
        this.id = null;
        this.activo = true;
        this.nombre = datos.nombre();
        this.email = datos.email();
        this.telefono = datos.telefono();
        this.documento = datos.documento();
        this.especialidad = datos.especialidad();
        this.direccion = new Direccion (datos.direccion());
    }

    public void actualizarDatos(@Valid DatosActualizacionMedico datos) {
        if (datos.nombre() != null){
            this.nombre = datos.nombre();
        }
        if (datos.telefono() != null){
            this.telefono = datos.telefono();
        }
        if (datos.direccion() != null){
            this.direccion.actualizarDireccion(datos.direccion());
        }
    }

    public void eliminar() {
        this.activo = false;
    }
}
