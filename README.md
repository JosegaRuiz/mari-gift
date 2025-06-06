# Mari-Gift

Juego de palabras y frases para María.

## Despliegue en GitHub Pages

Para actualizar el despliegue en GitHub Pages, sigue estos pasos:

1. **Construir la aplicación**:
   ```bash
   ng build --configuration production --base-href="https://JosegaRuiz.github.io/mari-gift/"
   ```

2. **Desplegar a GitHub Pages**:
   ```bash
   npx angular-cli-ghpages --dir=dist/mari-gift/browser
   ```

3. **Verificar el despliegue**:
   - Visita https://JosegaRuiz.github.io/mari-gift/ para comprobar que todo funciona correctamente
   - Asegúrate de que el PDF se carga correctamente en la página de victoria

## Solución de problemas comunes

- **Error 404 en rutas**: La aplicación usa HashLocationStrategy para manejar las rutas en GitHub Pages
- **PDF no visible**: Verifica que el archivo esté en la carpeta `assets` y que la ruta sea correcta
- **Cambios no visibles**: Puede ser necesario limpiar la caché del navegador