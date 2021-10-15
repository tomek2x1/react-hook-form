import { useState } from "react";
import { useForm } from "react-hook-form";
import "./App.css";

const App = () => {
  const [productNumber, setProductNumber] = useState(0);
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    watch,
  } = useForm();
  const onSubmit = (data) => console.log(data);

  const placeBuyArray = [
    "Sklep internetowy (www.emultimax.pl)",
    "Allegro (handto / SMA-Dimplex)",
    "Salon Sprzedaży Warszawa",
    "Salon Sprzedaży Kraków",
    "Salon Sprzedaży Rzeszów",
    "Salon Sprzedaży Zamość",
    "Punkt Sprzedaży Gdańsk",
    "Punkt Sprzedaży Poznań",
    "Telefonicznie",
  ];

  const reasonArray = [
    "Produkt nie spełnia moich oczekiwań",
    "Produkt niezgodny z zamówieniem",
    "Produkt niezgodny z opisem na stronie",
    "Inny powód",
    "Nie chcę podawać przyczyny",
  ];

  const placeBuyOptions = placeBuyArray.map((place, index) => {
    return (
      <option key={index} value={place}>
        {place}
      </option>
    );
  });

  const reasonOptions = reasonArray.map((reason, index) => {
    return (
      <option key={index} value={reason}>
        {reason}
      </option>
    );
  });

  // const addProductSmallForm = () => {
  //   const newProduct = {
  //     id: state.products.length,
  //     producer: "",
  //     typeProduct: "",
  //     quantity: 1,
  //   };
  //   setState({
  //     ...state,
  //     products: [...state.products, newProduct],
  //   });
  //   setShowButtonsError(false);
  // };

  return (
    <div className="App">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-wrapper">
          <h1 className="form-title">Formularz zwrotu</h1>
          <h2 className="form-subtitle">Dane klienta</h2>
          <label htmlFor="userName" className="form-label">
            Imię i nazwisko lub nazwa firmy:
            <input
              type="text"
              className="form-field"
              id="userName"
              name="userName"
              {...register("firstName", { required: true, minLength: 3 })}
            />
            {errors.firstName?.type === "required" && (
              <span className="form-error">
                Podaj imię i nazwisko lub nazwę firmy
              </span>
            )}
          </label>
          <label htmlFor="userEmail" className="form-label">
            Adres e-mail:
            <input
              type="text"
              className="form-field"
              id="userEmail"
              name="userEmail"
              {...register("userEmail", {
                required: true,
                pattern:
                  /^[a-z\d]+[\w\d.-]*@(?:[a-z\d]+[a-z\d-]+\.){1,5}[a-z]{2,6}$/i,
              })}
            />
            {errors.userEmail?.type === "required" && (
              <span className="form-error">Podaj adres e-mail</span>
            )}
            {errors.userEmail?.type === "pattern" && (
              <span className="form-error">
                Adres e-mail jest nieprawidłowy
              </span>
            )}
          </label>
          <label htmlFor="userPhone" className="form-label">
            Telefon:
            <input
              type="number"
              className="form-field"
              id="userPhone"
              name="userPhone"
              {...register("userPhone", {
                required: true,
                pattern: /^[0-9\+]{8,13}$/,
              })}
            />
            {errors.userPhone?.type === "required" && (
              <span className="form-error">Podaj numer telefonu</span>
            )}
            {errors.userPhone?.type === "pattern" && (
              <span className="form-error">
                Numer telefonu jest nieprawidłowy
              </span>
            )}
          </label>
          <h2 className="form-subtitle">Dane zamówienia</h2>
          <label htmlFor="placeBuy" className="form-label">
            Miejsce zakupu:
            <select
              className="form-field"
              id="placeBuy"
              name="placeBuy"
              {...register("placeBuy", {
                required: true,
              })}
            >
              <option value="" defaultValue readOnly>
                Wybierz
              </option>
              {placeBuyOptions}
            </select>
            {errors.placeBuy?.type === "required" && (
              <span className="form-error">Podaj miejsce zakupu</span>
            )}
          </label>
          {watch("placeBuy") === "Allegro (handto / SMA-Dimplex)" ? (
            <div className="form-warning">
              Pamiętaj! Jeżeli dokonałeś zakupu na stronie Allegro, zalecamy
              wykonanie zwrotu za pomocą serwisu Allegro, ponieważ znacznie
              skróci to proces przyjmowania zwrotu. Więcej szczegółów znajdziesz
              w zakładce "Zwroty"
            </div>
          ) : null}
          <label htmlFor="orderNumber" className="form-label">
            Numer zamówienia lub numer faktury:
            <input
              type="text"
              className="form-field"
              id="orderNumber"
              name="orderNumber"
              {...register("orderNumber", { required: true, minLength: 3 })}
            />
            {errors.orderNumber?.type === "required" && (
              <span className="form-error">
                Podaj numer zamówienia lub faktury
              </span>
            )}
          </label>
          <label htmlFor="payType" className="form-label">
            Sposób płatności za zamówienie:
            <select
              className="form-field"
              id="payType"
              name="payType"
              {...register("payType", {
                required: true,
              })}
            >
              <option value="" defaultValue readOnly>
                Wybierz
              </option>
              <option value="Przelew">Przelew</option>
              <option value="Inny sposób">Inny sposób</option>
            </select>
            {errors.payType?.type === "required" && (
              <span className="form-error">
                Podaj sposób płatności za zamówienie
              </span>
            )}
          </label>
          {watch("payType") === "Inny sposób" ? (
            <label htmlFor="accountNumber" className="form-label">
              Numer konta:
              <input
                type="number"
                className="form-field"
                id="accountNumber"
                name="accountNumber"
                {...register("accountNumber", {
                  required: watch("payType") === "Inny sposób" ? true : false,
                  pattern: /^[0-9]{26}$/,
                })}
              />
              {errors.accountNumber?.type === "required" && (
                <span className="form-error">Podaj numer konta</span>
              )}
              {errors.accountNumber?.type === "pattern" && (
                <span className="form-error">
                  Numer konta jest nieprawidłowy
                </span>
              )}
            </label>
          ) : null}

          <label htmlFor="reason" className="form-label">
            Powód odstąpienia:
            <select
              className="form-field"
              id="reason"
              name="reason"
              {...register("reason", {
                required: true,
              })}
            >
              <option value="" defaultValue readOnly>
                Wybierz
              </option>
              {reasonOptions}
            </select>
            {errors.reason?.type === "required" && (
              <span className="form-error">Podaj powód odstąpienia</span>
            )}
          </label>
          {watch("reason") === "Inny powód" ? (
            <label htmlFor="anotherReason" className="form-label">
              Podaj powód:
              <input
                type="number"
                className="form-field"
                id="anotherReason"
                name="anotherReason"
                {...register("anotherReason")}
              />
            </label>
          ) : null}
          <h2 className="form-subtitle">Zwracany produkt</h2>
          <div class="form__buttons-wrapper">
            <div class="form__btn-wrapper">
              <button class="form__btn form__btn--add">Dodaj pozycję</button>
              <button class="form__btn form__btn--remove">Usuń pozycję</button>
            </div>
          </div>
          <input type="submit" />
        </div>
      </form>
    </div>
  );
};

export default App;
