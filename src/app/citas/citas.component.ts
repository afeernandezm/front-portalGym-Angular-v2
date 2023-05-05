import { ServiceService } from './../services/service.service';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { format } from 'date-fns';


@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  gimnasios: any[] = [];
  citas: any[] = [];
  nombre_cliente:string="";
  fecha_cita="";
  public idCitaSeleccionada: number=0;
   /* fecha_formateada = this.fecha_cita.toLocaleDateString('es-ES'); */
  hora_cita:string="";
  nombre_gym:string="";
  /* telefono_cliente:string=""; */
  mostrarModal = false;
  constructor(private http: HttpClient, private servicioService: ServiceService) {
  }

  ngOnInit(): void {
    this.servicioService.getGimnasios()
      .subscribe((response: any[]) => {
        this.gimnasios = response;
      });

      this.servicioService.getCitas()
      ?.subscribe((response: any[]) => {
        this.citas = response;
      });
  }
  abrirModal() {
    this.mostrarModal = true;
  }
  cerrarModal() {
    this.mostrarModal = false;
  }
  seleccionarCita(id_cita: number) {
    this.idCitaSeleccionada = id_cita;
    console.log(id_cita)
  }

  isPastDate(dateString: string): boolean {
    const today = new Date();
    const rowDate = new Date(dateString);

    return rowDate.getFullYear() < today.getFullYear() ||
           rowDate.getMonth() < today.getMonth() ||
           rowDate.getDate() < today.getDate();
  }


  registrarCita(): void {
    const url = 'http://localhost:3000/portalGym/citas';
    const data = {
      nombre_cliente: this.nombre_cliente,
      fecha_cita: this.fecha_cita,
      hora_cita: this.hora_cita,
      nombre_gym: this.nombre_gym,
    };
    console.log(data);
    this.http.post(url, data).subscribe(
      (response) => {
        console.log(response);
        const formulario = document.getElementById('citaModal') as HTMLFormElement;
        const alertSuccess = document.createElement('div');
        alertSuccess.classList.add('alert', 'alert-success');
        alertSuccess.textContent = ("Cita creada con éxito");
        formulario.insertBefore(alertSuccess, formulario.firstChild);
        this.servicioService.getCitas()
      ?.subscribe((response: any[]) => {
        this.citas = response;
      });
      },
      (error) => {
        console.error(error);

      }
    );
  }


  editarCita(): void {
    const url = `http://localhost:3000/portalGym/citas/${this.idCitaSeleccionada}`;

    const data = {
      fecha_cita: this.fecha_cita,
      hora_cita: this.hora_cita
    };
    console.log(data);
    this.http.put(url, data).subscribe(
      (response) => {
        console.log(response);

        const formulario = document.getElementById('editar-cita-modal') as HTMLFormElement;
        const alertSuccess = document.createElement('div');
        alertSuccess.classList.add('alert', 'alert-success');
        alertSuccess.textContent = ("Cita actualizada con éxito");
        formulario.insertBefore(alertSuccess, formulario.firstChild);
        this.servicioService.getCitas()
        ?.subscribe((response: any[]) => {
          this.citas = response;
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }


  borrarCita(): void {
    const url = `http://localhost:3000/portalGym/borrar-citas/${this.idCitaSeleccionada}`;

    this.http.delete(url).subscribe(
      (response) => {
        console.log(response);

        const formulario = document.getElementById('eliminarCitaModal') as HTMLFormElement;
        const alertSuccess = document.createElement('div');
        alertSuccess.classList.add('alert', 'alert-success');
        alertSuccess.textContent = ("Cita eliminada con éxito");
        formulario.insertBefore(alertSuccess, formulario.firstChild);
        this.servicioService.getCitas()
        ?.subscribe((response: any[]) => {
          this.citas = response;
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }


}


