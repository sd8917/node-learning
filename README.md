## Security princpal

### 1️⃣ How do you handle secrets in Node.js?

- JWT secret keys
- DB credentials
- API keys
- OAuth client secrets
- Encryption keys

Use `.env` or `aws parameter storage`

- Rotate secrets regularly
 
 ## 3️⃣ How do you sanitize file uploads to avoid path traversal attacks?

```

❌

app.post("/upload", upload.single("file"), (req, res) => {
  fs.renameSync(req.file.path, "uploads/" + req.body.filename);
});


```

A. Never trust filenames

Use a random safe name:

B. Enforce allowed MIME types

Validate MIME in code, not just frontend.


```
const allowed = ["image/png", "image/jpeg", "application/pdf"];

if (!allowed.includes(req.file.mimetype)) {
  throw new Error("Invalid file type");
}


```

D. File size limit

E. Upload to external storage

Avoid storing directly on server:

AWS S3

Cloudinary

GCP Storage

## 4️⃣ How do you secure an Express API from common vulnerabilities?

A. Use Helmet

Protects from 11+ known attacks (XSS, sniffing, clickjacking):

```
const helmet = require("helmet");
app.use(helmet());

```

B. Rate Limit your API

Prevents brute force, floods, bot attack

```
const rateLimit = require("express-rate-limit");

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));



```

C. CSRF Protection

For session-based apps:

D. Disable X-Powered-By

Hides Express identity.

```
app.disable("x-powered-by");

```

E. Validate ALL inputs

Use Joi, Zod, or Yup

```
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

```

G. Use HTTPS everywhere

Redirect HTTP → HTTPS

H. Protect Cookies

JWT/Session cookies:

I. Disable CORS for unknown domains

```

const corsOptions = {
  origin: ["https://yourapp.com"],
  credentials: true,
}
app.use(cors(corsOptions));

```

L. Limit JSON payload size

Protects from JSON bombing:

```

app.use(express.json({ limit: "1mb" }));
```

