# Sole & Co. — Technical Gist

### (TL;DR version, 2 minute mein poora project samajh jao)

---

## Project kya hai?

**Sole & Co.** — joote bechne ki website. Buyers browse + buy karte hain, Sellers products list + orders manage karte hain. Ek AI chatbot bhi hai jo voice se baat kar sakta hai. SPA hai — page reload nahi hota.

---

## Tech Stack (ek line mein)

| Library             | Kya kaam     | Kyun                                                      |
| ------------------- | ------------ | --------------------------------------------------------- |
| **React 19**        | UI           | Industry standard + React Compiler (auto performance)     |
| **Vite 8**          | Build tool   | CRA se 10x fast, HMR instant                              |
| **Redux Toolkit**   | Global state | Prop drilling se bachao, 5 slices mein sab manage         |
| **React Router v7** | Routing      | URL se pages match karo                                   |
| **Axios**           | HTTP client  | Auto token refresh interceptor ke liye                    |
| **Tailwind CSS v4** | Styling      | Classes directly JSX mein, alag CSS file ka jhanjhat nahi |
| **React Icons v5**  | Icons        | 40k+ icons ek package mein                                |

---

## Folder Structure (seedha point pe)

```
src/
├── api/        → 7 files, sab API calls yahan (authApi, productsApi, ordersApi...)
├── components/ → 35 files, reusable pieces (ui/, chatbot/, product/, order/, auth/)
├── pages/      → 14 screens (6 public, 3 buyer, 5 seller)
├── store/      → Redux store + 5 slices
├── hooks/      → 3 custom hooks (useAuth, useToast, useChatbot)
└── utils/      → 5 helpers (constants, formatters, validators...)
```

---

## Redux Store — 5 Slices

| Slice        | Key state                                          | Thunks                             |
| ------------ | -------------------------------------------------- | ---------------------------------- |
| `auth`       | `user`, `isAuthenticated`, `initDone`              | login, logout, register, getMe     |
| `products`   | `items[]`, `selectedProduct`, `sellerProducts[]`   | fetch, create, update, delete      |
| `categories` | `items[]`                                          | fetchCategories                    |
| `orders`     | `buyerOrders{}`, `sellerOrders{}`, `selectedOrder` | place, fetch, cancel, updateStatus |
| `ui`         | `toasts[]`, `mobileMenuOpen`                       | addToast, removeToast (no async)   |

---

## Custom Hooks — 3 Hooks

**`useAuth()`** → Redux auth state + shortcut booleans: `isBuyer`, `isSeller`, `isAdmin`, `initDone`

**`useToast()`** → `toast.success()`, `toast.error()`, `toast.info()`, `toast.warning()` — dispatch karo, screen pe dikhe

**`useChatbot()`** → Chatbot ka poora engine: messages, voice input (Chrome only, en-IN), voice output (SpeechSynthesis), session (sessionStorage UUID), send/clear/toggle

---

## API Routes (28 total, base: `localhost:6969/api/v1`)

```
/auth          → register, login, logout, refresh-token, get-me
/products      → list, getOne, myProducts, create, update, delete
/orders        → place, myOrders, myOrder, cancel, sellerOrders, sellerOrder, updateStatus
/users/me      → profile, update, changePassword, avatar, deleteAccount
/reviews       → byProduct, create, update, delete, myReviews
/categories    → list, getOne
/chatbot       → message, clear-session
```

---

## Auth Ka Jugad

Axios interceptor — token expire hone pe (`401`) automatic `/auth/refresh-token` call, original request retry. Queue system bhi hai agar multiple requests ek saath fail ho jaayein. User ko pata nahi chalta.

`initDone` flag — app start pe `getMe` call hoti hai, jab tak complete nahi tab routes block. Phir `initDone: true`, app khulti hai.

---

## Deploy

`npm run dev` → Vite dev server with HMR
`npm run build` → production bundle
Hosted on **Vercel** — `vercel.json` mein SPA rewrite hai (`/* → /index.html`)

---

_Bhai itna kaafi hai. Zyada detail chahiye? `technicalSummary.md` padh._
