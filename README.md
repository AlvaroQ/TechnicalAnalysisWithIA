# TechnicalAnalysisWithIA - Análisis Técnico con IA

Aplicación web que utiliza Inteligencia Artificial para realizar análisis técnico de gráficos de valores. La aplicación permite a los usuarios subir imágenes de gráficos bursátiles y obtener análisis detallados sobre tendencias, patrones y señales técnicas. Usa modelo google_ai/gemini-2.0-flash y ha sido desarrollado con Next.js, Firebase y Google AI



## Acceso a la Aplicación

**URL de Producción:** [https://studio--portafolio-maestro.us-central1.hosted.app/](https://studio--portafolio-maestro.us-central1.hosted.app/)

<table>
<tr>
<td width="50%" align="center">
<b>Paso 1: Subir o pegar imagen del gráfico</b><br/>
Pega directamente una imagen o sube un archivo del gráfico de una acción.
</td>
<td width="50%" align="center">
<b>Paso 2: Análisis con IA</b><br/>
Recibe un análisis detallado con tendencias, patrones y señales técnicas identificadas por la IA.
</td>
</tr>
<tr>
<td width="50%" align="center">
<img src="https://github.com/AlvaroQ/TechnicalAnalysisWithIA/blob/main/captures/preview_2.png" width="100%" alt="Interfaz de carga de gráfico"/>
</td>
<td width="50%" align="center">
<img src="https://github.com/AlvaroQ/TechnicalAnalysisWithIA/blob/main/captures/preview_1.png" width="100%" alt="Resultados del análisis"/>
</td>
</tr>
</table>


## Funcionalidades

### 1. Análisis de Gráficos con IA
- **Carga de Imágenes**: Los usuarios pueden subir gráficos de trading en formatos JPG o PNG
- **Soporte para Indicadores**: La IA analiza indicadores técnicos como RSI, MACD, medias móviles, entre otros
- **Análisis Detallado**: Proporciona tres perspectivas diferentes:
  - **Análisis Detallado**: Evaluación completa de todos los aspectos técnicos
  - **Resumen y Niveles**: Vista simplificada con niveles clave de soporte y resistencia
  - **Indicadores Clave**: Enfoque en los indicadores técnicos más relevantes

### 2. Resultados Estructurados
El análisis incluye:
- **Tendencia General**: Evaluación de la dirección del mercado (alcista, bajista o lateral)
- **Patrones Identificados**: Detección de formaciones técnicas como doble techo, cabeza-hombros, etc.
- **Señales Técnicas**: Análisis de medias móviles, rupturas y soportes dinámicos
- **Conclusión**: Recomendación basada en el análisis completo

### 3. Interfaz Intuitiva
- Diseño clean y profesional
- Vista previa de la imagen cargada
- Resultados organizados en pestañas para fácil navegación
- Opción de reiniciar el análisis en cualquier momento

## Stack Tecnológico

### Frontend
- **Next.js 15.3**: Framework de React con soporte para Server-Side Rendering
- **React 18**: Biblioteca para interfaces de usuario
- **TypeScript 5**: Tipado estático para JavaScript
- **Tailwind CSS**: Framework de utilidades CSS
- **Radix UI**: Componentes accesibles y personalizables
  - Dialog, Tabs, Accordion, Toast, Select, y más
- **Lucide React**: Iconos SVG optimizados
- **React Hook Form**: Manejo de formularios con validaciones
- **Zod**: Validación de esquemas TypeScript-first

### Backend & IA
- **Firebase**: Plataforma de desarrollo (Hosting, Storage, etc.)
- **Genkit AI**: Framework para aplicaciones con IA generativa
- **Google AI**: Integración con modelos de IA de Google

### UI/UX
- **class-variance-authority**: Gestión de variantes de componentes
- **cmdk**: Componente de paleta de comandos
- **embla-carousel**: Carruseles accesibles
- **recharts**: Gráficos y visualizaciones
- **date-fns**: Utilidades para manejo de fechas

### Herramientas de Desarrollo
- **Turbopack**: Bundler ultra-rápido de Next.js
- **ESLint**: Linter para mantener código limpio
- **PostCSS**: Procesador de CSS

## Instalación y Desarrollo

### Prerrequisitos
- Node.js 20 o superior
- npm o yarn
- API Key de Google Gemini ([obtener aquí](https://aistudio.google.com/app/apikey))

### Guía de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/AlvaroQ/studio.git
   cd studio
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crea un archivo `.env.local` en la raíz del proyecto con la siguiente configuración:

   ```env
   GOOGLE_GENAI_API_KEY=tu_api_key_de_gemini_aqui
   ```

   > **Importante**: Necesitas obtener una API key de Google Gemini desde [Google AI Studio](https://aistudio.google.com/app/apikey) y reemplazar `tu_api_key_de_gemini_aqui` con tu clave.

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en [http://localhost:9002](http://localhost:9002)

### Scripts Disponibles

```bash
# Desarrollo local en puerto 9002
npm run dev

# Iniciar Genkit en modo desarrollo
npm run genkit:dev

# Genkit con hot-reload
npm run genkit:watch

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start

# Ejecutar linter
npm run lint

# Verificar tipos TypeScript
npm run typecheck
```

## Estructura del Proyecto

```
FireStudio/
├── src/
│   ├── app/           # Páginas y rutas de Next.js
│   ├── ai/            # Configuración y flujos de Genkit AI
│   └── components/    # Componentes React reutilizables
├── public/            # Archivos estáticos
└── ...
```


## Licencia

Este proyecto es parte de un proyecto personal para el curso de AI Expert.

---
