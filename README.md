# Idea Saver - AI-Powered Voice Notes

**From Passing Thought to Finished Plan**

Idea Saver is a modern web application designed to be more than just a voice recorder. It's your personal AI assistant for capturing, structuring, and expanding on your best ideas. Record your thoughts, meetings, or spontaneous inspirations, and let our AI-powered tools turn them into titled, transcribed, and actionable notes.

![Idea Saver Demo](https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)
_Captura de pantalla de la interfaz de Idea Saver (ejemplo visual)_

---

📜 **Tabla de Contenidos**

*   [🌟 Acerca del Proyecto](#acerca-del-proyecto)
*   [🚀 Funcionalidades Actuales](#funcionalidades-actuales)
*   [🛠️ Stack Tecnológico](#stack-tecnologico)
*   [⚙️ Instalación y Configuración](#instalacion-y-configuracion)
*   [🏛️ Decisiones Arquitectónicas Clave](#decisiones-arquitectonicas-clave)
*   [🗺️ Roadmap Futuro](#roadmap-futuro)
*   [🤝 Contribuciones](#contribuciones)
*   [📄 Licencia](#licencia)

---

🌟 **Acerca del Proyecto**

Idea Saver es una herramienta innovadora que transforma la forma en que capturas y gestionas tus pensamientos. Diseñada para ser intuitiva y potente, permite a los usuarios grabar notas de voz y, mediante inteligencia artificial, convertirlas en texto, generar títulos relevantes y procesarlas para extraer información clave. El objetivo es cerrar la brecha entre una idea fugaz y un plan concreto, optimizando el flujo de trabajo creativo y productivo.

El proyecto está construido sobre una arquitectura moderna y escalable, utilizando Supabase como backend para la autenticación, la persistencia de datos y el almacenamiento de archivos, y aprovechando las Edge Functions para el procesamiento de IA de baja latencia.

---

🚀 **Funcionalidades Actuales**

Idea Saver ofrece un conjunto robusto de características para ayudarte a capturar y organizar tus ideas de manera eficiente:

*   **🎙️ Captura de Voz Instantánea:**
    *   Grabación de audio de alta calidad directamente en tu navegador.
    *   Los datos se guardan inicialmente en tu dispositivo para máxima privacidad.
    *   Control de grabación con temporizador y visualización del estado.

*   **✨ Transcripción Impulsada por IA:**
    *   Convierte tu audio en texto preciso y legible en segundos.
    *   Utiliza Edge Functions de Supabase para un procesamiento rápido y eficiente.
    *   Deducción de créditos por transcripción (1 crédito por minuto de audio).

*   **🧠 Titulado Inteligente:**
    *   Nuestra IA analiza automáticamente la transcripción y genera un título conciso y relevante para cada nota, ahorrándote el esfuerzo de nombrarlas.
    *   El título se genera junto con la transcripción, utilizando un crédito adicional.

*   **🔐 Autenticación Segura:**
    *   Sistema completo de registro e inicio de sesión con Supabase Auth, incluyendo email/contraseña y Google OAuth.
    *   Gestión robusta de sesiones y protección de rutas.

*   **💰 Sistema de Créditos y Regalos:**
    *   Los usuarios reciben créditos gratuitos al registrarse para usar las funciones de IA.
    *   Posibilidad de canjear códigos de regalo para añadir nuevos créditos.
    *   El saldo de créditos se actualiza en tiempo real en la interfaz y se persiste en la base de datos.

*   **☁️ Sincronización Segura en la Nube (Función Pro):**
    *   Copia de seguridad segura de tus notas y transcripciones en la nube.
    *   Acceso a tus ideas desde cualquier dispositivo, en cualquier momento.
    *   Configuración de sincronización automática y políticas de retención de datos.

*   **🎨 Interfaz de Usuario Moderna y Responsiva:**
    *   Una interfaz elegante y adaptable, construida con Tailwind CSS y shadcn/ui.
    *   Animaciones fluidas y micro-interacciones con Framer Motion para una experiencia de usuario premium.
    *   Soporte para temas claro y oscuro.

*   **Historial de Notas:**
    *   Visualiza y gestiona todas tus notas grabadas y transcritas.
    *   Funcionalidades de búsqueda, filtrado y ordenación (próximamente).
    *   Reproducción de audio, edición, compartición y eliminación de notas.

---
### Project Structure

The codebase is organized to maintain a clean separation of concerns, making it easy to navigate and scale.

```
/
├── app/                # Next.js 13 App Router pages (UI routes)
├── components/         # Reusable UI components (built with shadcn/ui)
├── src/
│   ├── components/     # Core application components (e.g., Header, RecordingControls)
│   ├── hooks/          # Custom React hooks (e.g., useAuth)
│   ├── lib/            # Utility functions, Supabase client, i18n config
│   └── store/          # Zustand global state store
└── supabase/
    ├── functions/      # Deno Edge Functions (transcribe-audio, generate-title)
    └── migrations/     # SQL database schema migrations
```
---
🛠️ **Stack Tecnológico**

Idea Saver está construido con una pila de tecnologías modernas para garantizar rendimiento, escalabilidad y una excelente experiencia de desarrollo:

*   **Framework Frontend:** [Next.js 13](https://nextjs.org/) (con App Router) [9], [16], [22], [24], [29]
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Backend & Base de Datos:** [Supabase](https://supabase.io/)
    *   **Autenticación:** Supabase Auth (Email/Password, Google OAuth)
    *   **Base de Datos:** Supabase Postgres
    *   **Funciones Serverless:** [Supabase Edge Functions](https://supabase.com/docs/guides/functions) (Deno) para transcripción y titulación AI. [1], [2], [8], [12], [28]
*   **Estilos:**
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [shadcn/ui](https://ui.shadcn.com/) para la biblioteca de componentes. [21], [23], [25], [26], [30]
    *   [Framer Motion](https://www.framer.com/motion/) para animaciones. [3], [7], [11], [14], [15]
*   **Gestión de Estado:**
    *   [Zustand](https://zustand-demo.pmnd.rs/) para la gestión de estado global. [10], [13], [18], [20], [27]
    *   [React Context API](https://react.dev/reference/react/useContext) para estados específicos (`useAuth`).
*   **Manejo de Formularios:** [React Hook Form](https://react-hook-form.com/) [4], [5], [6], [17], [19]
*   **Internacionalización (i18n):** `i18next` y `react-i18next`
*   **Linting & Formato:** ESLint & Prettier

---
### Supabase Backend

The backend is fully managed by Supabase, leveraging its powerful suite of tools.

1.  **Database Schema:** The database schema is defined in the SQL files within `supabase/migrations`. The core tables are `profiles` (to store user data and credits) and potentially tables for notes and transcriptions (for cloud sync).
2.  **Row-Level Security (RLS):** RLS is enabled on all tables containing user data, ensuring that users can only access and modify their own information. Policies are written in SQL and are part of the database migrations.
3.  **Edge Functions:**
    -   `transcribe-audio`: This function takes an audio file, sends it to a third-party AI service (like Google's Speech-to-Text), and returns the transcription.
    -   `generate-title`: This function receives the transcription text, sends it to a generative AI model (like GPT), and returns a suitable title.
    -   `redeem-gift-code`: This function validates a gift code and, if valid, updates the user's credits in the `profiles` table.

---

⚙️ **Instalación y Configuración**

Sigue estas instrucciones para obtener una copia local del proyecto en funcionamiento.

### **Prerrequisitos**

*   [Node.js](https://nodejs.org/) (v18 o posterior)
*   npm o yarn
*   [Cuenta de Supabase](https://supabase.com/dashboard) y [Supabase CLI](https://supabase.com/docs/guides/cli)

### **Pasos de Instalación**

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/your-username/idea-saver.git
    cd idea-saver
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura Supabase:**
    *   Inicia sesión en la CLI de Supabase: `supabase login`
    *   Vincula tu repositorio local a tu proyecto de Supabase: `supabase link --project-ref <YOUR_PROJECT_ID>`
    *   Empuja las migraciones de la base de datos: `supabase db push`
    *   Despliega las Edge Functions: `supabase functions deploy`

4.  **Configura las Variables de Entorno:**
    *   Crea un archivo `.env.local` en la raíz del proyecto copiando el archivo `.env.example`.
    *   Obtén tu URL de API y la clave `anon` desde la configuración de API de tu proyecto Supabase.
    *   Añade estas claves a tu archivo `.env.local`:
        ```
        NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
        NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
        SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
        GOOGLE_API_KEY=your-google-ai-api-key
        ```
        _Asegúrate de que `SUPABASE_SERVICE_ROLE_KEY` y `GOOGLE_API_KEY` estén configuradas para las Edge Functions._

5.  **Ejecuta el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

🏛️ **Decisiones Arquitectónicas Clave**

*   **Next.js App Router:** Se eligió el App Router de Next.js 13 por su enfoque en el enrutamiento basado en archivos, la capacidad de usar React Server Components (aunque no se explota completamente en el frontend actual, es una base sólida para el futuro), y la mejora en la gestión de layouts y estados de carga. [9], [16], [22], [24], [29]
*   **Supabase como Backend Completo:** Supabase proporciona una solución "todo en uno" para autenticación, base de datos PostgreSQL, almacenamiento de archivos y funciones serverless (Edge Functions). Esto simplifica enormemente la infraestructura y el desarrollo del backend.
*   **Supabase Edge Functions (Deno):** Para el procesamiento de IA (transcripción y titulación), se utilizan Edge Functions escritas en Deno. Esto permite ejecutar lógica de backend cerca del usuario para una latencia mínima y un rendimiento óptimo, además de aprovechar la seguridad y el entorno TypeScript-first de Deno. [1], [2], [8], [12], [28]
*   **Zustand para Gestión de Estado Global:** Se prefirió Zustand sobre otras soluciones como Redux o el Context API puro por su simplicidad, ligereza y rendimiento. Permite una gestión de estado global eficiente con un boilerplate mínimo y evita re-renders innecesarios. [10], [13], [18], [20], [27]
*   **React Hook Form para Formularios:** Para el manejo de formularios, React Hook Form fue la elección debido a su rendimiento superior (minimizando re-renders), su API intuitiva y su capacidad para manejar validaciones complejas con facilidad. [4], [5], [6], [17], [19]
*   **Tailwind CSS y shadcn/ui:** Esta combinación ofrece un sistema de diseño altamente personalizable y eficiente. Tailwind permite un desarrollo rápido de UI con clases de utilidad, mientras que shadcn/ui proporciona componentes accesibles y bien diseñados que se integran perfectamente con Tailwind. [21], [23], [25], [26], [30]
*   **Framer Motion para Animaciones:** Para una experiencia de usuario pulida y atractiva, Framer Motion se utiliza para crear animaciones fluidas y gestos interactivos con una sintaxis declarativa y un rendimiento optimizado. [3], [7], [11], [14], [15]

---

🗺️ **Roadmap Futuro**

Estamos constantemente trabajando para mejorar Idea Saver. Aquí hay algunas características planificadas para el futuro:

*   **Herramientas de Contenido Avanzadas:**
    *   Resumir notas largas.
    *   Expandir ideas en borradores detallados.
    *   Generar planes de proyecto o listas de tareas a partir de transcripciones.
*   **Búsqueda de Texto Completo:** Implementar una búsqueda avanzada en el contenido de las notas para encontrar rápidamente cualquier idea.
*   **Organización de Notas:** Añadir funcionalidades para etiquetar, categorizar y archivar notas.
*   **Integración con Calendarios/Tareas:** Conectar ideas con herramientas de productividad externas.
*   **Paquetes de Créditos:** Ofrecer la opción de comprar paquetes de créditos adicionales para usuarios del plan gratuito.
*   **Soporte Multi-idioma:** Expandir la transcripción y titulación a más idiomas.
*   **Colaboración:** Permitir compartir notas y colaborar en ideas con otros usuarios.

---

🤝 **Contribuciones**

¡Las contribuciones son bienvenidas! Si deseas contribuir, por favor, sigue estos pasos:

1.  Haz un fork del repositorio.
2.  Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3.  Realiza tus cambios y asegúrate de que el código pase los tests y el linter.
4.  Haz commit de tus cambios (`git commit -m 'feat: añade nueva funcionalidad X'`).
5.  Sube tu rama (`git push origin feature/nueva-funcionalidad`).
6.  Abre un Pull Request detallado.

---

📄 **Licencia**

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
