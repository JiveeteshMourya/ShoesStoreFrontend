export function isTrimmedEmpty(val) {
  return !val || !String(val).trim();
}

export function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim());
}

export function validateLogin({ email, password }) {
  const errors = {};
  if (isTrimmedEmpty(email)) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address";
  if (isTrimmedEmpty(password)) errors.password = "Password is required";
  return errors;
}

export function validateRegister({ firstName, lastName, email, password }) {
  const errors = {};
  const fn = String(firstName || "").trim();
  const ln = String(lastName || "").trim();
  if (!fn) errors.firstName = "First name is required";
  else if (fn.length < 2) errors.firstName = "First name must be at least 2 characters";
  else if (fn.length > 50) errors.firstName = "First name must be 50 characters or fewer";
  if (!ln) errors.lastName = "Last name is required";
  else if (ln.length < 2) errors.lastName = "Last name must be at least 2 characters";
  else if (ln.length > 50) errors.lastName = "Last name must be 50 characters or fewer";
  if (isTrimmedEmpty(email)) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address";
  const pw = String(password || "");
  if (!pw) errors.password = "Password is required";
  else if (pw.length < 8) errors.password = "Password must be at least 8 characters";
  return errors;
}

export function validateProfileInfo({ firstName, lastName, phone }) {
  const errors = {};
  const fn = String(firstName || "").trim();
  const ln = String(lastName || "").trim();
  if (!fn) errors.firstName = "First name is required";
  else if (fn.length < 2) errors.firstName = "First name must be at least 2 characters";
  else if (fn.length > 50) errors.firstName = "First name must be 50 characters or fewer";
  if (!ln) errors.lastName = "Last name is required";
  else if (ln.length < 2) errors.lastName = "Last name must be at least 2 characters";
  else if (ln.length > 50) errors.lastName = "Last name must be 50 characters or fewer";
  const ph = String(phone || "").trim();
  if (ph && ph.length > 20) errors.phone = "Phone must be 20 characters or fewer";
  return errors;
}

export function validateProfileAddress({ street, city, state, zipCode, country }) {
  const errors = {};
  const check = (val, key, label) => {
    if (val && String(val).trim().length > 100)
      errors[key] = `${label} must be 100 characters or fewer`;
  };
  check(street, "street", "Street");
  check(city, "city", "City");
  check(state, "state", "State");
  check(zipCode, "zipCode", "ZIP code");
  check(country, "country", "Country");
  return errors;
}

export function validatePasswordChange({ currentPassword, newPassword }) {
  const errors = {};
  if (isTrimmedEmpty(currentPassword)) errors.currentPassword = "Current password is required";
  const np = String(newPassword || "");
  if (!np) errors.newPassword = "New password is required";
  else if (np.length < 8) errors.newPassword = "New password must be at least 8 characters";
  return errors;
}

export function validateProductForm({ name, description, brand, category, basePrice, tags }) {
  const errors = {};
  const n = String(name || "").trim();
  if (!n) errors.name = "Product name is required";
  else if (n.length < 2) errors.name = "Name must be at least 2 characters";
  else if (n.length > 200) errors.name = "Name must be 200 characters or fewer";
  const d = String(description || "").trim();
  if (!d) errors.description = "Description is required";
  else if (d.length < 10) errors.description = "Description must be at least 10 characters";
  else if (d.length > 2000) errors.description = "Description must be 2000 characters or fewer";
  const b = String(brand || "").trim();
  if (!b) errors.brand = "Brand is required";
  else if (b.length > 100) errors.brand = "Brand must be 100 characters or fewer";
  if (!category) errors.category = "Please select a category";
  const price = Number(basePrice);
  if (isTrimmedEmpty(basePrice)) errors.basePrice = "Base price is required";
  else if (isNaN(price) || price < 0) errors.basePrice = "Base price must be 0 or greater";
  if (tags) {
    const tagList = String(tags)
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);
    if (tagList.length > 10) errors.tags = "Maximum 10 tags allowed";
  }
  return errors;
}

export function validateVariants(variants) {
  if (!variants || variants.length === 0)
    return { variants: "At least one size variant is required" };
  for (let i = 0; i < variants.length; i++) {
    const row = i + 1;
    const { size, stock, price } = variants[i];
    if (isTrimmedEmpty(size)) return { variants: `Row ${row}: size is required` };
    else if (Number(size) <= 0) return { variants: `Row ${row}: size must be greater than 0` };
    if (isTrimmedEmpty(stock)) return { variants: `Row ${row}: stock is required` };
    else if (Number(stock) < 0) return { variants: `Row ${row}: stock must be 0 or greater` };
    if (!isTrimmedEmpty(price) && Number(price) < 0)
      return { variants: `Row ${row}: price must be 0 or greater` };
  }
  return {};
}

export function validateReview({ rating, comment }) {
  const errors = {};
  if (!rating || rating < 1 || rating > 5) errors.rating = "Please select a rating between 1 and 5";
  const c = String(comment || "");
  if (c.length > 1000) errors.comment = "Comment must be 1000 characters or fewer";
  return errors;
}
