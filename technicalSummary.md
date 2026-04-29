# Sole & Co. Frontend — Technical Summary

### (Gen-Z edition, padh le bhai)

---

## 1. Kya hai ye project? (The Big Picture)

Ye hai **Sole & Co.** — ek shoes ki online dukaan. Amazon jaisi, but sirf joote. Aur thoda zyada swaggy.

Ye ek **SPA** (Single Page App) hai — matlab page reload nahi hota, sab kuch smoothly change hota hai. User login karke joote dekh sakta hai, buy kar sakta hai. Sellers apna khud ka dashboard hai jahan wo products list karte hain aur orders manage karte hain.

Short mein bola toh:

- **Buyers** — browse karo, buy karo, review likho, orders track karo
- **Sellers** — products daalo, orders dekho, status update karo
- **AI Chatbot** bhi hai — baat karo, products suggest karwao, voice se bhi (haan seriously)

Backend `http://localhost:6969/api/v1` pe bhaag raha hai. Port 6969. Koi comment nahi.

---

## 2. Tech Stack — Kya use kiya aur kyun? (The Real Talk)

### React 19

**Kya hai:** UI banane wala JavaScript framework. Component-based — matlab ek chhota sa button se lekar poori page, sab "components" hain.

**Kyun use kiya:** Industry standard hai bhai. Sab use karte hain. React seekha toh naukri pakki. Plus React 19 mein **React Compiler** aaya hai jo automatically performance optimize karta hai — `useMemo` aur `useCallback` manually likhna padta tha pehle, ab compiler khud kar leta hai.

---

### Vite 8

**Kya hai:** Build tool + dev server. Code likhte ho, Vite isko browser ke liye package karta hai.

**Kyun use kiya:** Purana Create React App bahut slow tha — save karo, 3 second wait karo, page reload. Vite mein **HMR** (Hot Module Replacement) hai — save karo, 50ms mein update. Productivity ka level alag hi ho jaata hai.

---

### Redux Toolkit (RTK)

**Kya hai:** App ka "global brain" — pura state (data) ek jagah store hota hai.

**Kyun use kiya:** Imagine karo — user login kiya, uska naam 10 alag components mein dikhana hai. Bina Redux ke har component ko alag se pass karna padta "prop drilling" bolte hain isko aur ye bohot frustrating hai. RTK ek central store banata hai, koi bhi component directly wahan se data le sakta hai. Purana Redux bohot boilerplate tha (action types, action creators, reducers — sab alag alag). RTK ne sab ek saath pack kar diya — `createSlice` mein sab ho jaata hai.

---

### React Router DOM v7

**Kya hai:** URL ke hisaab se pages dikhata hai — `/products` pe jaao toh products page, `/login` pe jaao toh login page.

**Kyun use kiya:** SPA mein actual page load nahi hota, toh React Router yeh illusion create karta hai ki pages change ho rahe hain. v7 mein nested routes aur better code-splitting support aaya.

---

### Axios

**Kya hai:** HTTP client — backend API se baat karne ke liye.

**Kyun use kiya:** Browser ka built-in `fetch()` bhi kaam karta hai, but Axios mein **interceptors** hain. Interceptor basically ek "security guard" hai jo har request/response ke beech mein baithta hai. Yahan interceptor iska kaam hai: agar backend ne `401 Unauthorized` diya (matlab token expire ho gaya), toh automatically naya token request karta hai aur failed request retry karta hai. User ko pata bhi nahi chalta. Ye sab `fetch()` mein khud likhna padta.

---

### Tailwind CSS v4

**Kya hai:** Utility-first CSS framework — classes directly HTML/JSX mein likhte ho.

**Kyun use kiya:** Normal CSS mein alag `.css` file banana padta, class name sochna padta, phir use karna padta. Tailwind mein seedha `className="flex items-center gap-4 text-sm font-bold"` likh do, kaam khatam. v4 mein Vite plugin aaya toh setup aur bhi easy ho gaya. Ek baar haath lag gaya toh speed bahut fast ho jaati hai.

---

### React Icons v5

**Kya hai:** 40,000+ icons — ek package mein, sab free.

**Kyun use kiya:** Khud SVG icons banana boring hai. Lucide, Feather, Material Icons — sab ek jagah `react-icons` mein. Seedha import karo, use karo. Simple.

---

## 3. Folder Structure — Files Kahan Rakhi Hain Aur Kyun?

```
src/
├── api/           → Backend se baat karne wali files
├── components/    → Reusable UI ke tukde
├── hooks/         → Custom React hooks
├── pages/         → Poore pages (routes ke saath match hote hain)
├── store/         → Redux brain
└── utils/         → Helper functions
```

### `src/api/` — Backend ka Interpreter

Backend se koi bhi baat karni ho, yahan se hogi. 7 files hain:

| File               | Kya karta hai                                               |
| ------------------ | ----------------------------------------------------------- |
| `axiosInstance.js` | Configured axios — base URL set hai, interceptors lage hain |
| `authApi.js`       | Login, logout, register, token refresh                      |
| `productsApi.js`   | Products CRUD                                               |
| `ordersApi.js`     | Orders place karna, track karna, status update              |
| `usersApi.js`      | Profile update, password change, avatar                     |
| `reviewsApi.js`    | Reviews likhna, edit karna, delete karna                    |
| `categoriesApi.js` | Product categories fetch karna                              |

**Kyun alag folder:** Agar backend ka URL change ho gaya kal ko, ek jagah change karo — `constants.js` mein. Poori app update. No hunting for URLs across 50 files.

---

### `src/components/` — Building Blocks (35 files)

Yahan sab chhote chhote reusable pieces hain. Ek baar banao, baar baar use karo.

**Subfolders:**

- **`ui/` (13 files)** — Generic stuff: `Button`, `Input`, `Modal`, `Spinner`, `Badge`, `Select`, `Textarea`, `StarRating`, `Pagination`, `Toast` system. Ye everywhere use hote hain.

- **`chatbot/` (7 files)** — AI chatbot ke saare parts: `ChatWidget` (floating button), `ChatWindow` (poora chat UI), `ChatMessage` (ek message), `ChatInput` (type karne ki jagah), `ProductCard` (chatbot ke andar product suggest karne ke liye), `SentimentBadge` (user ka mood detect karta hai), `SourcePill` (AI ne kahan se info li wo dikhata hai).

- **`product/` (6 files)** — `ProductCard`, `ProductGrid`, `ProductFilters`, `ImageGallery`, `SizeSelector`, `ReviewSection`.

- **`order/` (3 files)** — `OrderCard`, `OrderStatusBadge`, `OrderStatusStepper` (step-by-step order progress dikhata hai).

- **`auth/` (2 files)** — `ProtectedRoute` (login nahi kiya toh andar nahi aane deta), `RoleRoute` (buyer seller routes alag karta hai).

- **`layout/` (2 files)** — `PageWrapper` (consistent page padding/spacing), `SectionTitle`.

- **Root level** — `Navbar`, `Footer`, `Hero`, `ErrorBoundary` (app crash ho toh graceful message dikhao, white screen nahi).

---

### `src/pages/` — 14 Pages

Ye actual "screens" hain jo user dekhta hai. Route ke hisaab se match hoti hain.

**Public (koi bhi dekh sakta hai):**

- `HomePage` — landing page, hero section, featured products
- `ProductsPage` — saare products with filters
- `ProductDetailPage` — ek product ki detail, images, reviews
- `LoginPage` / `RegisterPage` — auth forms
- `NotFoundPage` — 404

**Buyer only (login hona chahiye):**

- `ProfilePage` — profile edit karo
- `OrdersPage` — apne orders dekho
- `OrderDetailPage` — ek order ki detail

**Seller only (seller role hona chahiye):**

- `SellerDashboardPage` — overview
- `SellerProductsPage` — apne products list
- `ProductFormPage` — naya product add karo ya edit karo (same component, dono kaam karta hai)
- `SellerOrdersPage` — orders jinhe fulfill karna hai
- `SellerOrderDetailPage` — ek order ki detail, status update karo

---

### `src/store/` — Redux ka Daftar

Redux store yahan configure hai. Ek central `configureStore` call hai jisme 5 reducers plug in hain. Bas.

```
store
 ├── auth         ← authReducer
 ├── products     ← productsReducer
 ├── categories   ← categoriesReducer
 ├── orders       ← ordersReducer
 └── ui           ← uiReducer
```

`store/hooks.js` mein sirf 2 lines hain:

```js
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
```

Normal `useSelector`/`useDispatch` ke bajaye ye use karo — ek jagah change karo, sab jagah reflect hoga.

---

#### `authSlice` — Login ka Dil-o-Dimag

**State shape:**

```js
{
  user: null,           // logged-in user ka poora object (name, email, role, avatar, etc.)
  isAuthenticated: false,
  loading: false,       // koi bhi async operation chal raha hai?
  error: null,          // error message string
  initDone: false       // app start pe "kya user logged in hai?" check ho gaya?
}
```

**Thunks (async actions):**

| Thunk                 | Kya karta hai                                            | State change                           |
| --------------------- | -------------------------------------------------------- | -------------------------------------- |
| `getMeThunk`          | App load pe session check karta hai (`GET /auth/get-me`) | `user` set hota hai, `initDone: true`  |
| `loginThunk(creds)`   | Login karo (`POST /auth/login`)                          | `user` + `isAuthenticated: true`       |
| `registerThunk(data)` | Account banao (`POST /auth/register`)                    | Sirf loading handle, login alag se     |
| `logoutThunk`         | Logout (`POST /auth/logout`)                             | `user: null`, `isAuthenticated: false` |

**Sync actions (directly dispatch karo):**

- `resetAuth()` — Token refresh fail hua? Sab saaf karo. Interceptor ye call karta hai.
- `updateUser(payload)` — Profile update hua? Partial merge karo store mein. Full re-fetch ki zaroorat nahi.

**Ek important cheez:** `initDone` flag. App start pe `getMeThunk` call hoti hai — jab tak ye complete nahi hoti, app routes ko block karta hai (spinner dikhata hai). Warna user ko `/profile` pe blank screen milti. Ye flag batata hai "check ho gaya, aage badho."

---

#### `productsSlice` — Products Ki Duniya

**State shape:**

```js
{
  // public product listing (buyer ke liye)
  items: [],            // products ka array
  total: 0,             // total kitne products hain (pagination ke liye)
  page: 1,              // current page
  totalPages: 1,
  loading: false,
  error: null,
  selectedProduct: null,        // detail page ke liye ek product
  selectedProductLoading: false,

  // seller ka apna dashboard
  sellerProducts: [],
  sellerTotal: 0,
  sellerPage: 1,
  sellerTotalPages: 1,
  sellerLoading: false,
}
```

**Thunks:**

| Thunk                                | API Call                           | Kya karta hai                                                     |
| ------------------------------------ | ---------------------------------- | ----------------------------------------------------------------- |
| `fetchProductsThunk(params)`         | `GET /products`                    | Buyer ki listing fetch karo (filters, sort, page sab params mein) |
| `fetchProductThunk(slugOrId)`        | `GET /products/:slugOrId`          | Detail page ke liye ek product                                    |
| `fetchSellerProductsThunk(params)`   | `GET /products/seller/my-products` | Seller ke apne products                                           |
| `createProductThunk(formData)`       | `POST /products`                   | Naya product banao + `sellerProducts` ke shuru mein add karo      |
| `updateProductThunk({id, formData})` | `PATCH /products/:id`              | Product update karo + store mein bhi update                       |
| `deleteProductThunk(id)`             | `DELETE /products/:id`             | Delete karo + `sellerProducts` se hata do                         |

**Sync actions:**

- `clearSelectedProduct()` — Detail page se bahar jaao toh purana product data clear karo

**Smart part:** `updateProductThunk` success pe store mein dono jagah update karta hai — `sellerProducts` array mein bhi aur agar wahi `selectedProduct` hai toh usme bhi. Backend se dobara fetch karne ki zaroorat nahi.

---

#### `categoriesSlice` — Simple aur Seedha

**State shape:**

```js
{
  items: [],      // saari categories ka array
  loading: false,
  error: null,
}
```

**Thunks:**

| Thunk                  | API Call          | Kya karta hai                          |
| ---------------------- | ----------------- | -------------------------------------- |
| `fetchCategoriesThunk` | `GET /categories` | Ek baar fetch karo, store mein rakh do |

Koi sync action nahi. Categories change nahi hoti frequently — ek baar fetch, bas. No rocket science.

---

#### `ordersSlice` — Buyer aur Seller ke Orders Alag Alag

**State shape:**

```js
{
  buyerOrders: {
    items: [],        // buyer ke orders
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
  },
  sellerOrders: {
    items: [],        // seller ke orders
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
  },
  selectedOrder: null,          // detail page ke liye
  selectedOrderLoading: false,
  placeOrderLoading: false,     // order place ho raha hai?
  error: null,
}
```

**Thunks:**

| Thunk                                             | API Call                               | Kya karta hai                                   |
| ------------------------------------------------- | -------------------------------------- | ----------------------------------------------- |
| `placeOrderThunk(data)`                           | `POST /orders`                         | Order place karo + `buyerOrders.items` mein add |
| `fetchMyOrdersThunk(params)`                      | `GET /orders/my`                       | Buyer ke orders (paginated)                     |
| `fetchMyOrderThunk(orderId)`                      | `GET /orders/my/:orderId`              | Buyer ka ek order detail                        |
| `cancelOrderThunk({orderId, cancelReason})`       | `PATCH /orders/my/:orderId/cancel`     | Order cancel + store update                     |
| `fetchSellerOrdersThunk(params)`                  | `GET /orders/seller`                   | Seller ke orders (paginated)                    |
| `fetchSellerOrderThunk(orderId)`                  | `GET /orders/seller/:orderId`          | Seller ka ek order detail                       |
| `updateOrderStatusThunk({orderId, status, note})` | `PATCH /orders/seller/:orderId/status` | Status update + store update                    |

**Sync actions:**

- `clearSelectedOrder()` — Detail page se bahar jaao toh clear karo

**Smart part:** `cancelOrderThunk` aur `updateOrderStatusThunk` dono success pe store mein 2 jagah update karte hain — `selectedOrder` bhi aur list mein bhi. No refresh needed.

---

#### `uiSlice` — App Ki "Bhavnaayein"

Ye slice sirf UI state handle karta hai — koi backend call nahi, koi async nahi.

**State shape:**

```js
{
  toasts: [],           // active toast notifications ka array
  mobileMenuOpen: false // navbar ka mobile menu khula hai ya band?
}
```

**Toast system:**

- `addToast({ message, type, duration })` — naya toast add karo. `type` options: `"info"`, `"success"`, `"error"`, `"warning"`. Default duration: 4000ms. Auto-incremented ID milta hai.
- `removeToast(id)` — toast dismiss hone pe hata do

**Mobile menu:**

- `toggleMobileMenu()` — open/close
- `closeMobileMenu()` — force close (route change pe call hota hai)

---

### `src/hooks/` — Custom Hooks

React mein "hooks" ek pattern hai — logic ko component se bahar nikaalo taaki reuse ho sake aur component clean rahe.

---

#### `useAuth()` — "Kaun Hai Main?"

```js
const { user, isAuthenticated, loading, initDone, role, isBuyer, isSeller, isAdmin } = useAuth();
```

Ye hook Redux `auth` slice se data nikaalta hai aur convenient boolean flags expose karta hai. Component mein `useAppSelector(state => state.auth.user?.role === "seller")` likhne ki jagah seedha `isSeller` use karo.

**Kya return karta hai:**
| Property | Type | Kya hai |
|----------|------|---------|
| `user` | object / null | Poora user object (name, email, role, avatar, etc.) |
| `isAuthenticated` | boolean | Login hai ya nahi |
| `loading` | boolean | Koi auth operation chal raha hai |
| `initDone` | boolean | App start pe session check complete hua? |
| `role` | string / null | `"buyer"`, `"seller"`, `"admin"`, ya `null` |
| `isBuyer` | boolean | `user.role === "buyer"` |
| `isSeller` | boolean | `user.role === "seller"` |
| `isAdmin` | boolean | `user.role === "admin"` |

**Kyun useful hai:** `ProtectedRoute` aur `RoleRoute` ye hook use karte hain. Navbar mein bhi — agar `isSeller` hai toh seller dashboard link dikhao. Har jagah ek hi hook, consistent.

---

#### `useToast()` — Notifications Seedhi Tarrah

```js
const toast = useToast();
toast.success("Order placed!");
toast.error("Something went wrong.");
toast.info("Loading...");
toast.warning("Low stock!");
```

Ye hook Redux `uiSlice` ka `addToast` action dispatch karta hai. Directly `dispatch(addToast({...}))` likhne se zyada clean hai.

**Kya return karta hai:**
| Method | Type parameter | Default duration |
|--------|---------------|-----------------|
| `toast.success(message)` | `"success"` | 4000ms |
| `toast.error(message)` | `"error"` | 4000ms |
| `toast.info(message)` | `"info"` | 4000ms |
| `toast.warning(message)` | `"warning"` | 4000ms |

`ToastContainer` component Redux store se `toasts` array read karta hai aur screen pe render karta hai. `useToast` → `addToast` → store → `ToastContainer` → screen. Clean pipeline.

---

#### `useChatbot()` — Chatbot Ka Poora Engine

Chatbot ka sabse bada hook. Ye Redux use nahi karta — apna local state manage karta hai `useState` aur `useRef` se. Wajah: chatbot ka data rest of the app se independent hai, global store mein rakhne ki koi zaroorat nahi.

**State jo manage karta hai:**

```js
messages; // chat history array
input; // current text input
loading; // message send ho raha hai?
isOpen; // chat window khula hai ya band?
isListening; // voice input active hai?
isSpeaking; // TTS (text-to-speech) bol raha hai?
voiceOutputEnabled; // voice output on/off (localStorage mein save hota hai)
sessionId; // sessionStorage se, har browser session mein unique UUID
```

**Kya return karta hai (poora API surface):**

| Return value           | Kya karta hai                                                            |
| ---------------------- | ------------------------------------------------------------------------ |
| `messages`             | Render karne ke liye poori chat history                                  |
| `input` / `setInput`   | Controlled text input ke liye                                            |
| `loading`              | Send button disable karo jab wait kar rahe ho                            |
| `isOpen` / `setIsOpen` | Chat window toggle karo                                                  |
| `isListening`          | Mic button ka active state                                               |
| `isSpeaking`           | TTS chal raha hai (stop button dikhao)                                   |
| `voiceOutputEnabled`   | Toggle button ki state                                                   |
| `sendMessage(text)`    | Message bhejo — user message add karo, API call karo, bot reply add karo |
| `clearSession`         | Chat history clear karo + backend session bhi reset karo                 |
| `toggleVoice`          | Mic start/stop karo (Web Speech API)                                     |
| `toggleVoiceOutput`    | Voice output on/off karo                                                 |
| `stopSpeaking`         | TTS immediately band karo                                                |

**Voice input flow:**

1. `toggleVoice()` call hoti hai
2. `SpeechRecognition` (ya `webkitSpeechRecognition` Chrome mein) start hota hai
3. Language: `en-IN`, `interimResults: false` (sirf final result chahiye)
4. User bolta hai → `transcript` milta hai → seedha `sendMessage(transcript)` call
5. Chrome only — baaki browsers mein `alert()` dikhta hai

**Voice output flow:**

1. Bot ka reply aaya
2. `voiceOutputEnabled` true hai?
3. `speak(reply)` call hoti hai
4. Markdown clean hota hai pehle (`cleanForSpeech` function — asterisks, backticks, links hata do)
5. `SpeechSynthesisUtterance` create, `lang: "en-IN"`, `rate: 0.95`
6. Voice preference: Google English > Microsoft English > koi bhi English voice
7. Chrome mein voices async load hoti hain — agar list abhi empty hai toh `onvoiceschanged` event ka wait karo

**Session management:**

- `sessionId` ek `useRef` mein hai — re-render pe change nahi hota
- `sessionStorage` mein UUID save rehta hai — tab close karo toh naya session
- `clearSession()` backend ko bhi batata hai (`POST /chatbot/clear-session`) + naya UUID generate karta hai

---

### `src/utils/` — Helpers

Chhoti chhoti utility functions.

- **`constants.js`** — `backendUrl = "http://localhost:6969/api/v1"` — ek jagah, ek baar
- **`formatters.js`** — Prices format karo (₹1,999), dates format karo, etc.
- **`imageUrl.js`** — Image URLs handle karna (Cloudinary ya local)
- **`orderHelpers.js`** — Order status colors, labels, steps
- **`validators.js`** — Form validation — email sahi hai? Password strong hai?

---

## 4. API Routes — Backend Se Baat Kaise Hoti Hai?

Base URL: `http://localhost:6969/api/v1`

### Auth Routes (`/auth`)

| Method | Route                 | Kya karta hai                    |
| ------ | --------------------- | -------------------------------- |
| `POST` | `/auth/register`      | Naya account banao               |
| `POST` | `/auth/login`         | Login karo                       |
| `POST` | `/auth/logout`        | Logout karo                      |
| `POST` | `/auth/refresh-token` | Access token expire hua? Naya lo |
| `GET`  | `/auth/get-me`        | Current logged-in user ki info   |

---

### Products Routes (`/products`)

| Method   | Route                          | Kya karta hai                                      |
| -------- | ------------------------------ | -------------------------------------------------- |
| `GET`    | `/products`                    | Saare products (filter, sort, pagination ke saath) |
| `GET`    | `/products/:slugOrId`          | Ek product ki full detail                          |
| `GET`    | `/products/seller/my-products` | Seller ke apne products                            |
| `POST`   | `/products`                    | Naya product create karo (seller only)             |
| `PATCH`  | `/products/:id`                | Product update karo                                |
| `DELETE` | `/products/:id`                | Product delete karo                                |

---

### Orders Routes (`/orders`)

| Method  | Route                            | Kya karta hai               |
| ------- | -------------------------------- | --------------------------- |
| `POST`  | `/orders`                        | Order place karo            |
| `GET`   | `/orders/my`                     | Buyer ke saare orders       |
| `GET`   | `/orders/my/:orderId`            | Buyer ka ek specific order  |
| `PATCH` | `/orders/my/:orderId/cancel`     | Order cancel karo           |
| `GET`   | `/orders/seller`                 | Seller ko aaye saare orders |
| `GET`   | `/orders/seller/:orderId`        | Seller ka ek specific order |
| `PATCH` | `/orders/seller/:orderId/status` | Order ka status update karo |

---

### Users Routes (`/users`)

| Method   | Route                       | Kya karta hai             |
| -------- | --------------------------- | ------------------------- |
| `GET`    | `/users/me`                 | Apna profile dekho        |
| `PATCH`  | `/users/me`                 | Profile update karo       |
| `PATCH`  | `/users/me/change-password` | Password change karo      |
| `PATCH`  | `/users/me/avatar`          | Profile photo update karo |
| `DELETE` | `/users/me`                 | Account delete karo (rip) |

---

### Reviews Routes (`/reviews`)

| Method   | Route                         | Kya karta hai               |
| -------- | ----------------------------- | --------------------------- |
| `GET`    | `/reviews/product/:productId` | Ek product ke saare reviews |
| `POST`   | `/reviews/product/:productId` | Review likho                |
| `PATCH`  | `/reviews/:reviewId`          | Review edit karo            |
| `DELETE` | `/reviews/:reviewId`          | Review delete karo          |
| `GET`    | `/reviews/my`                 | Apne likhe saare reviews    |

---

### Categories Routes (`/categories`)

| Method | Route                   | Kya karta hai         |
| ------ | ----------------------- | --------------------- |
| `GET`  | `/categories`           | Saari categories      |
| `GET`  | `/categories/:slugOrId` | Ek category ki detail |

---

### Chatbot Routes (`/chatbot`)

| Method | Route                    | Kya karta hai                    |
| ------ | ------------------------ | -------------------------------- |
| `POST` | `/chatbot/message`       | AI ko message bhejo, response lo |
| `POST` | `/chatbot/clear-session` | Chat history reset karo          |

---

## 5. Auth Ka Jugad — Token Refresh Interceptor

Ye thoda interesting hai. Modern apps mein **access tokens** short-lived hote hain (15 min ya 1 ghanta). Agar token expire ho gaya aur user kuch karne ki koshish kare — toh request fail ho jaegi aur user ko manually logout + login karna padega. Bohot annoying.

Iska solution: **Refresh Token Interceptor**.

**Kaise kaam karta hai:**

1. Axios koi request bhejta hai backend ko
2. Backend bolta hai `401 Unauthorized` (token expire)
3. Interceptor pakadta hai ye response
4. Automatic `/auth/refresh-token` call karta hai new token ke liye
5. Naaya token milta hai
6. Original failed request retry karta hai
7. User ko pata bhi nahi chala kuch hua

**Queue system bhi hai:** Agar refresh already chal raha hai aur 3 aur requests aake fail ho gayi, toh unhe line mein khada kar deta hai. Refresh complete hote hi sab retry ho jaate hain. No chaos.

---

## 6. Routing — Kaun Kaun Kahan Ja Sakta Hai

**Public routes** — bina login ke bhi khul te hain:

- `/` → HomePage
- `/products` → ProductsPage
- `/products/:slugOrId` → ProductDetailPage
- `/login` → LoginPage
- `/register` → RegisterPage

**Protected routes** — login karna padega:

- `/profile` → ProfilePage

**Buyer routes** — login + buyer role:

- `/orders` → OrdersPage
- `/orders/:orderId` → OrderDetailPage

**Seller routes** — login + seller role:

- `/seller` → SellerDashboardPage
- `/seller/products` → SellerProductsPage
- `/seller/products/new` → ProductFormPage (create mode)
- `/seller/products/:id/edit` → ProductFormPage (edit mode)
- `/seller/orders` → SellerOrdersPage
- `/seller/orders/:orderId` → SellerOrderDetailPage

**`ProtectedRoute`** — check karta hai login hai ya nahi. Nahi toh `/login` pe redirect.
**`RoleRoute`** — check karta hai sahi role hai ya nahi. Galat role toh homepage pe wapas.

---

## 7. Chatbot — AI Wala Feature (Isko Seriously Banaya Hai)

Ye sirf ek novelty feature nahi hai. Ye actually functional hai.

**UI:** Ek floating button (neeche right corner mein) — click karo toh chat window khulta hai. Classic chatbot style.

**Features:**

- **Text chat** — normal questions pucho, products ke baare mein
- **Voice input** — mic pe click karo, bolke pucho (Web Speech API, `en-IN` language). Chrome mein hi kaam karta hai.
- **Voice output** — AI ka reply sunna chahte ho? Toggle kar lo. SpeechSynthesis API use karta hai, Google/Microsoft English voices prefer karta hai.
- **Product suggestions** — AI products recommend karta hai, cards ke saath dikhta hai
- **Sentiment detection** — AI samajhta hai user khush hai, neutral hai ya frustrated — `SentimentBadge` dikhta hai
- **Source citations** — AI ne kahan se info li wo `SourcePill` ke roop mein dikhta hai
- **Session management** — `sessionStorage` mein session ID rakha jaata hai taaki chat history ek session mein bani rahe

**Message structure:**

```json
{
  "role": "user" | "bot",
  "content": "message text",
  "sentiment": "happy" | "neutral" | "sad",
  "sources": [...],
  "tool_used": "product_search",
  "suggested_products": [...]
}
```

---

## 8. Styling — CSS Ka Scene

### Tailwind CSS v4

Classes directly JSX mein likhte hain. Koi separate CSS file nahi (mostly). Build time pe sirf wahi CSS generate hota hai jo actually use hua — file size chhoti rehti hai.

### CSS Custom Properties (Variables)

`index.css` mein kuch CSS variables define kiye hain jo poore app mein use hote hain:

```css
--color-primary      /* main dark color */
--color-secondary    /* muted text */
--color-accent       /* highlight color */
--color-background   /* page background */
--color-border       /* borders */
--color-success      /* green */
--color-error        /* red */
--color-warning      /* yellow */
--color-info         /* blue */
```

Iska fayda: Kal ko theme change karni ho toh sirf yahan ek jagah change karo. Poora app update. Dark mode bhi isi pattern se add ho sakta hai.

### Fonts (Google Fonts se)

- **Montserrat** → Headings (bold, modern)
- **Open Sans** → Body text (readable, clean)
- **Playfair Display** → Editorial/decorative titles (luxury vibe ke liye)

---

## 9. Build & Deploy — Ship Kaise Hota Hai?

### NPM Scripts

```bash
npm run dev      # Dev server start karo, HMR ke saath
npm run build    # Production ke liye build karo
npm run preview  # Production build locally preview karo
npm run lint     # ESLint run karo, code errors check karo
npm run format   # Prettier run karo, code format karo
```

### Vite ka kaam

- Development mein fast HMR (Hot Module Replacement) — save karo, turant update
- Production mein **Rollup** se bundle karta hai — optimized, minified files
- **React Compiler** via Babel — React 19 ka naya feature, auto-optimization

### Vercel Deployment

`vercel.json` mein ek simple rewrite rule hai:

```json
{ "source": "/(.*)", "destination": "/index.html" }
```

Ye SPA ke liye zaroori hai. User seedha `/products/nike-air-max` pe jaaye toh Vercel usse `index.html` pe redirect karta hai, React Router baaki handle kar leta hai. Without this, 404 aata.

### Code Quality Tools

- **ESLint** — code mein bugs aur bad patterns pakadta hai (unused variables, React hooks rules, etc.)
- **Prettier** — code formatting automatically sahi karta hai (single quotes, semicolons, indentation)

---

## 10. Entry Point — App Kaise Start Hoti Hai?

`main.jsx` pe sab kuch wrap hota hai:

```
StrictMode
  └── ErrorBoundary (crash hone pe UI dikhao)
        └── Provider (Redux store inject karo)
              └── BrowserRouter (routing enable karo)
                    └── App (routing, navbar, footer, chatbot, toasts)
```

`App.jsx` mein:

- Saare routes define hain
- `Navbar` aur `Footer` globally render hote hain
- `ToastContainer` globally render hota hai (notification popping up ke liye)
- `ChatWidget` globally render hota hai (chatbot button har page pe)
- App start hote hi `getMeThunk` dispatch hota hai — check karo session active hai ya nahi, tab `initDone: true` set hota hai

---

## Quick Reference Card

| Cheez            | Detail                                     |
| ---------------- | ------------------------------------------ |
| Framework        | React 19                                   |
| Build Tool       | Vite 8                                     |
| State Management | Redux Toolkit                              |
| Routing          | React Router v7                            |
| HTTP Client      | Axios (with token refresh interceptor)     |
| Styling          | Tailwind CSS v4 + CSS variables            |
| Icons            | React Icons v5                             |
| Fonts            | Montserrat, Open Sans, Playfair Display    |
| Backend Port     | 6969 (lol)                                 |
| Deploy           | Vercel                                     |
| Total Pages      | 14                                         |
| Total Components | 35+                                        |
| API Endpoints    | 28                                         |
| Redux Slices     | 5 (auth, products, categories, orders, ui) |
| Custom Hooks     | 3 (useAuth, useChatbot, useToast)          |

---

_Bas itna hi hai. Ab koi excuse nahi hai "mujhe project samajh nahi aaya." Padh liya, samajh liya, chad gaye._ 🫡
