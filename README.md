# TxnValidator — Transaction Data Validator & Processor

A production-ready full-stack web application for uploading, validating, and processing transaction CSV files. Built as an **Implementation Internship Assignment**.

---

## Features

- **CSV Upload** — Drag & drop or browse. Shows filename and row count.
- **Validation Engine** — Country-specific phone rules (India/Singapore/USA), date format validation, payment mode whitelist, amount checks, duplicate detection, and missing field checks.
- **Validation Dashboard** — Live stat cards: total, valid, invalid rows; error breakdown by category.
- **Error Report** — Download `errors.csv` with row_number, order_id, error_reason.
- **Clean Data Export** — Download `cleaned_data.csv` with only valid rows.
- **CSV Chunking** — Split clean data into 1,000 / 5,000 / 10,000 row chunks.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React (Vite), Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| File Processing | Multer, csv-parser, json2csv |

---

## Project Structure

```
project/
├── backend/
│   ├── controllers/
│   │   ├── uploadController.js
│   │   ├── validateController.js
│   │   ├── downloadController.js
│   │   └── chunkController.js
│   ├── services/
│   │   ├── csvParser.js
│   │   ├── csvWriter.js
│   │   ├── validationService.js
│   │   └── sessionStore.js
│   ├── validators/
│   │   └── transactionValidator.js
│   ├── middleware/
│   │   └── multerConfig.js
│   ├── routes/
│   │   ├── upload.js
│   │   ├── validate.js
│   │   ├── download.js
│   │   └── chunk.js
│   ├── uploads/           # Auto-created at runtime
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── FileDropzone.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── ErrorTable.jsx
│   │   │   └── ChunkDownloader.jsx
│   │   ├── pages/
│   │   │   ├── UploadPage.jsx
│   │   │   └── ResultsPage.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── sample_transactions.csv
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload CSV file |
| `POST` | `/api/validate` | Run validation on uploaded data |
| `GET` | `/api/download/clean` | Download cleaned_data.csv |
| `GET` | `/api/download/errors` | Download errors.csv |
| `POST` | `/api/chunk` | Split data into chunks |
| `GET` | `/api/download/chunk/:filename` | Download a specific chunk |
| `GET` | `/api/health` | Health check |

---

## Validation Rules

### Phone Numbers
| Country | Rule |
|---------|------|
| India | 10 digits |
| Singapore | 8 digits |
| USA | 10 digits |

> Rules are configurable in `backend/validators/transactionValidator.js` — add/edit the `PHONE_RULES` object.

### Date Formats
- `YYYY-MM-DD` ✅
- `DD-MM-YYYY` ✅
- Anything else ❌

### Payment Modes
Allowed: `UPI`, `CARD`, `NETBANKING`, `COD`

### Amount
- Must be numeric
- Must be greater than 0

### Data Integrity
- Detects missing `order_id`, `phone`, `amount`, `customer_name`
- Detects duplicate `order_id` values

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend

```bash
cd backend
npm install
# Edit .env if needed
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
# Edit .env if needed (set VITE_API_URL)
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000
```

---

## Sample CSV

A `sample_transactions.csv` is included in the root. It contains 20 rows including:
- Valid rows across India, USA, Singapore
- Invalid phone (wrong digit count)
- Invalid date format
- Invalid payment mode (CRYPTO)
- Negative amount
- Duplicate order_id
- Missing phone

---

## Deployment

### Backend → Render

1. Push the `backend/` directory to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   - `PORT` = `5000`
   - `FRONTEND_URL` = your Vercel URL

### Frontend → Vercel

1. Push the `frontend/` directory to GitHub
2. Import to [Vercel](https://vercel.com)
3. Framework preset: **Vite**
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
5. Deploy

---

## Extending Validation Rules

To add a new country's phone rule, open `backend/validators/transactionValidator.js`:

```js
const PHONE_RULES = {
  India: 10,
  Singapore: 8,
  USA: 10,
  UK: 11,      // ← add new country here
  Canada: 10,
};
```

To add a new payment mode, edit `PAYMENT_MODES`:

```js
const PAYMENT_MODES = ["UPI", "CARD", "NETBANKING", "COD", "WALLET"];
```

---

## License

MIT — Built for Implementation Internship Assignment.
