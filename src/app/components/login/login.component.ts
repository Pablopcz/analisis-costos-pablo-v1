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

  credenciales = {
    usuario: '', 
    password: ''
  };

  // 1. FUNCIÓN PARA EL BOTÓN AZUL (Manual)
  async entrar() {
    try {
      const resultado = await signInWithEmailAndPassword(this.auth, this.credenciales.usuario, this.credenciales.password);
      
      // Guardamos los datos para que el formulario los use
      const datosUsuario = {
        displayName: 'Usuario Manual',
        email: resultado.user.email
      };
      localStorage.setItem('usuario', JSON.stringify(datosUsuario));

      console.log('✅ Entraste con éxito');
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error(error);
      alert('❌ Error: Usuario o contraseña no válidos');
    }
  }

  // 2. FUNCIÓN PARA EL BOTÓN ROJO (Google) - LA MÁS IMPORTANTE
  async loginConGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const resultado = await signInWithPopup(this.auth, provider);
      
      // EXTRAEMOS LOS DATOS DE GOOGLE
      const datosUsuario = {
        displayName: resultado.user.displayName,
        email: resultado.user.email,
        photoURL: resultado.user.photoURL
      };

      // LOS GUARDAMOS EN EL NAVEGADOR
      localStorage.setItem('usuario', JSON.stringify(datosUsuario));
      
      console.log('✅ Entraste con Google:', datosUsuario.displayName);
      
      // Saltamos al formulario/dashboard
      this.router.navigate(['/dashboard']); 
    } catch (error: any) {
      console.error(error);
      alert('❌ Error al conectar con Google');
    }
  }
}