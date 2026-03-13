import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  // Estas variables permiten que lo que escribas en los inputs se guarde aquí
  credenciales = {
    usuario: '', 
    password: ''
  };

  // FUNCIÓN PARA EL BOTÓN AZUL (Manual)
  async entrar() {
    try {
      // Intentamos entrar con el correo y clave que escribiste
      // Nota: El 'usuario' debe ser un correo en Firebase (ej: cesarzuniga@gmail.com)
      await signInWithEmailAndPassword(this.auth, this.credenciales.usuario, this.credenciales.password);
      
      console.log('✅ Entraste con éxito');
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error(error);
      alert('❌ Error: Usuario o contraseña no válidos en Firebase');
    }
  }

  // FUNCIÓN PARA EL BOTÓN ROJO (Google)
  async loginConGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      
      console.log('✅ Entraste con Google');
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error(error);
      alert('❌ Error al conectar con Google');
    }
  }
}