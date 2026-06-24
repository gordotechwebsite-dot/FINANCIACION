# Instrucciones para hacer cambios en la app de Financiacion

## Requisitos previos

- Node.js (version 18 o superior): https://nodejs.org
- Git: https://git-scm.com

## Pasos para hacer cambios y desplegar

### 1. Clonar el repositorio (solo la primera vez)

```bash
git clone https://github.com/gordotechwebsite-dot/FINANCIACION.git
cd FINANCIACION
npm install
```

### 2. Si ya tienes el repositorio clonado

```bash
cd FINANCIACION
git pull origin init
npm install
```

### 3. Hacer los cambios

Edita los archivos que necesites. Los archivos principales son:

- `src/components/ClientForm.tsx` - Formulario de datos del cliente
- `src/components/TradeInForm.tsx` - Formulario del equipo entregado
- `src/components/DesiredPhoneForm.tsx` - Formulario del equipo deseado
- `src/components/FinancingForm.tsx` - Configuracion de financiacion
- `src/components/ResultsView.tsx` - Vista de resultados y confirmacion
- `src/utils/pdfGenerator.ts` - Generador del PDF
- `src/utils/sheetsExport.ts` - Envio de datos a Google Sheets
- `src/utils/calculations.ts` - Calculos de financiacion e intereses

### 4. Probar localmente

```bash
npm run dev
```

Esto abre la app en http://localhost:5173 para que la pruebes antes de desplegar.

### 5. Compilar y desplegar

```bash
npm run build
npx gh-pages -d dist
```

Espera 1-2 minutos y los cambios estaran visibles en https://financiacion.gordotech.co

---

## Informacion importante

### Configuracion actual

- **Hosting:** GitHub Pages (gratuito)
- **Dominio:** financiacion.gordotech.co (CNAME en Namecheap)
- **Source de GitHub Pages:** Deploy from a branch → gh-pages → / (root)
- **Rama principal:** init
- **Rama de despliegue:** gh-pages (se actualiza automaticamente con `npx gh-pages -d dist`)

### Google Sheets (webhooks)

Cada sede tiene su propio Google Sheets. Las URLs estan en `src/utils/sheetsExport.ts`:

- **Duitama:** Hoja "Financiaciones" en gordotechduitama@gmail.com
- **Tunja:** Hoja separada en la misma cuenta
- **Clinica:** Hoja separada en la misma cuenta

Si necesitas cambiar una URL de webhook, edita el archivo `src/utils/sheetsExport.ts`.

### NO tocar

- No cambies el Source de GitHub Pages (debe ser "Deploy from a branch" con gh-pages)
- No elimines ni modifiques las implementaciones de Apps Script en Google
- No borres el archivo `public/CNAME` (contiene el dominio personalizado)
- No borres la rama `gh-pages`

### Renovacion del dominio

El dominio gordotech.co se renueva anualmente en Namecheap. Si se vence, el subdominio financiacion.gordotech.co dejara de funcionar. La app seguira disponible en: https://gordotechwebsite-dot.github.io/FINANCIACION/

### Tasas de interes

- Mensual: 6% (maximo 3 cuotas)
- Quincenal: 5% (maximo 6 cuotas)

Para cambiar las tasas, edita `src/utils/calculations.ts`.
