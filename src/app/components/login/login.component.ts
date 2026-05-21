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

  // ✅ LOGIN MANUAL (AGREGAMOS TU USUARIO FICTICIO)
  async entrar() {
    try {

      // 🔥 1. USUARIO FICTICIO (PRIMERO)
      if (
        this.credenciales.usuario === 'mia@demo.com' &&
        this.credenciales.password === '12345'
      ) {
        const datosUsuario = {
          displayName: 'Usuario Demo',
          email: this.credenciales.usuario
        };

        localStorage.setItem('usuario', JSON.stringify(datosUsuario));

        console.log('✅ Entrastes con usuario ficticio');
        this.router.navigate(['/dashboard']);
        return;
      }

      // 🔥 2. LOGIN ORIGINAL (NO LO TOCAMOS)
      const resultado = await signInWithEmailAndPassword(
        this.auth,
        this.credenciales.usuario,
        this.credenciales.password
      );

      const datosUsuario = {
        displayName: 'Usuario Manual',
        email: resultado.user.email
      };

      localStorage.setItem('usuario', JSON.stringify(datosUsuario));

      console.log('✅ Entraste con Firebase');
      this.router.navigate(['/dashboard']);

    } catch (error: any) {
      console.error(error);
      alert('❌ Usuario o contraseña incorrectos');
    }
  }

  // ✅ GOOGLE (NO SE TOCA)
  async loginConGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const resultado = await signInWithPopup(this.auth, provider);

      const datosUsuario = {
        displayName: resultado.user.displayName,
        email: resultado.user.email,
        photoURL: resultado.user.photoURL
      };

      localStorage.setItem('usuario', JSON.stringify(datosUsuario));

      console.log('✅ Entraste con Google:', datosUsuario.displayName);
      this.router.navigate(['/dashboard']);

    } catch (error: any) {
      console.error(error);
      alert('❌ Error al conectar con Google');
    }
  }
}
``