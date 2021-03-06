import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactTooltip from "react-tooltip";

const schema = yup.object({
  firstName: yup.string().required(),
  userEmail: yup
    .string()
    .required()
    .matches(/^[a-z\d]+[\w\d.-]*@(?:[a-z\d]+[a-z\d-]+\.){1,5}[a-z]{2,6}$/i),
  userPhone: yup
    .string()
    .required()
    .matches(/^[0-9\+]{8,13}$/),
  placeBuy: yup.string().required(),
  orderNumber: yup.string().required(),
  payType: yup.string().required(),
  accountNumber: yup.string().when("payType", {
    is: "Inny sposób",
    then: yup
      .string()
      .required()
      .matches(/^[0-9]{26}$/),
  }),
  reason: yup.string().required(),
  products: yup.array().of(
    yup.object().shape({
      productName: yup.string().required("test"),
      producer: yup.string().required(),
      quantity: yup.number().required(),
    })
  ),
  rodo: yup
    .boolean()
    .oneOf([true], "Zgoda jest wymagana")
    .required("Zgoda jest wymagana"),
});

const Form = ({
  setShowForm,
  setShowSpinner,
  setShowSuccess,
  setShowError,
  setTaskNumber,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  useEffect(() => append({ productName: "", producer: "", quantity: 1 }), []);

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

  const producerArray = [
    "Blaupunkt",
    "Climative",
    "Danfoss",
    "Devi",
    "Digitime",
    "Dimplex",
    "Ebeco",
    "Eberle",
    "Emko",
    "Esco",
    "Nexans",
    "Rotenso",
    "Sonniger",
    "Thermoval",
    "Vaco",
    "Warmtec",
    "Inny",
  ];

  const placeBuyOptions = placeBuyArray.map((place, index) => {
    return (
      <option key={index} value={place} className="form-option">
        {place}
      </option>
    );
  });

  const reasonOptions = reasonArray.map((reason, index) => {
    return (
      <option key={index} value={reason} className="form-option">
        {reason}
      </option>
    );
  });

  const producerOptions = producerArray.map((producer, index) => {
    return (
      <option key={index} value={producer} className="form-option">
        {producer}
      </option>
    );
  });

  const onSubmit = (data) => {
    setShowForm(false);
    setShowSpinner(true);

    const products = data.products.map((product, index) => {
      return `
      <h5>Produkt ${index + 1}</h5>
      <b>Producent:</b> ${product.producer} <br/>
      <b>Nazwa produktu:</b> ${product.productName} <br/>
      <b>Ilość:</b> ${product.quantity} <br/>
      <br/>
        `;
    });

    const url = "https://newaccount1632792215290.freshdesk.com/api/v2/tickets";
    const body = {
      subject: "Formularz zwrotu (online)",
      description: `
      <b>Imię i nazwisko lub nazwa firmy:</b> ${data.firstName} <br/>
      <b>Adres e-mail:</b> ${data.userEmail} <br/>
      <b>Telefon:</b> ${data.userPhone} <br/>
      <br/>
      <b>Miejsce zakupu:</b> ${data.placeBuy} <br/>
      <b>Numer zamówienia lub numer faktury:</b> ${data.orderNumber} <br/>
      <b>Sposób płatności za zamówienie:</b> ${data.payType} <br/>
      ${
        data.payType !== "Przelew"
          ? `<b>Numer rachunku bankowego:</b> ${data.accountNumber} <br/>`
          : ""
      }
      <br/>
      <b>Powód odstąpienia:</b> ${data.reason} <br/>
      ${
        data.anotherReason
          ? `<b>Dlaczego odstępuję:</b> ${data.anotherReason} <br/>`
          : ""
      }
      <br/>
      ${products}
      `,
      email: data.userEmail,
      phone: data.userPhone,
      priority: 1,
      status: 2,
    };

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: "VHE3djNOUEFwUWFSNXhscG80Zg==",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    })
      .then((resp) => resp.json())
      .then(function (data) {
        if (data.id) {
          setShowSpinner(false);
          setShowSuccess(true);
          setTaskNumber(data.id);
        } else {
          setShowSpinner(false);
          setShowError(true);
        }
      })
      .catch(function (error) {
        setShowSpinner(false);
        setShowError(true);
        console.log(error);
      });
  };

  return (
    <div className="App">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-wrapper">
          <h1 className="form-title">Formularz zwrotu</h1>
          <h2 className="form-subtitle form-subtitle-first">Dane klienta</h2>
          <label htmlFor="userName" className="form-label">
            Imię i nazwisko lub nazwa firmy:
            <span className="form-star">*</span>
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
            Adres e-mail:<span className="form-star">*</span>
            <input
              type="text"
              className="form-field"
              id="userEmail"
              name="userEmail"
              {...register("userEmail", {
                required: true,
              })}
            />
            {errors.userEmail?.type === "required" && (
              <span className="form-error">Podaj adres e-mail</span>
            )}
            {errors.userEmail?.type === "matches" && (
              <span className="form-error">
                Adres e-mail jest nieprawidłowy
              </span>
            )}
          </label>
          <label htmlFor="userPhone" className="form-label">
            Telefon:<span className="form-star">*</span>
            <input
              type="number"
              className="form-field"
              id="userPhone"
              name="userPhone"
              {...register("userPhone", {
                required: true,
              })}
            />
            {errors.userPhone?.type === "required" && (
              <span className="form-error">Podaj numer telefonu</span>
            )}
            {errors.userPhone?.type === "matches" && (
              <span className="form-error">
                Numer telefonu jest nieprawidłowy
              </span>
            )}
          </label>
          <h2 className="form-subtitle">Dane zamówienia</h2>
          <label htmlFor="placeBuy" className="form-label">
            Miejsce zakupu:<span className="form-star">*</span>
            <select
              className="form-field"
              id="placeBuy"
              name="placeBuy"
              {...register("placeBuy", {
                required: true,
              })}
            >
              <option value="" defaultValue readOnly className="form-option">
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
            <span className="form-star">*</span>
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
            Sposób płatności za zamówienie:<span className="form-star">*</span>
            <select
              className="form-field"
              id="payType"
              name="payType"
              {...register("payType", {
                required: true,
              })}
            >
              <option value="" defaultValue readOnly className="form-option">
                Wybierz
              </option>
              <option value="Przelew" className="form-option">
                Przelew
              </option>
              <option value="Inny sposób" className="form-option">
                Inny sposób
              </option>
            </select>
            {errors.payType?.type === "required" && (
              <span className="form-error">
                Podaj sposób płatności za zamówienie
              </span>
            )}
          </label>
          {watch("payType") === "Inny sposób" ? (
            <label htmlFor="accountNumber" className="form-label">
              Numer konta bankowego:<span className="form-star">*</span>
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
                <span className="form-error">Podaj numer konta bankowego</span>
              )}
              {errors.accountNumber?.type === "pattern" && (
                <span className="form-error">
                  Numer konta jest nieprawidłowy
                </span>
              )}
            </label>
          ) : null}

          <label htmlFor="reason" className="form-label">
            Powód odstąpienia:<span className="form-star">*</span>
            <select
              className="form-field"
              id="reason"
              name="reason"
              {...register("reason", {
                required: true,
              })}
            >
              <option value="" defaultValue readOnly className="form-option">
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
                type="text"
                className="form-field"
                id="anotherReason"
                name="anotherReason"
                {...register("anotherReason")}
              />
            </label>
          ) : null}
          <h2 className="form-subtitle">Zwracany produkt</h2>

          {fields.map((field, index) => (
            <div className="form-product-card" key={index}>
              <div className="form-product-header">
                <div className="form-product-name">Produkt {index + 1}</div>
                {index !== 0 ? (
                  <span
                    className="form-product-remove"
                    onClick={() => remove(index)}
                  >
                    x
                  </span>
                ) : null}
              </div>
              <div className="form-product-body">
                <label
                  htmlFor={`products[${index}].producer`}
                  className="form-label"
                >
                  Producent:<span className="form-star">*</span>
                  <select
                    className="form-field"
                    id={`products[${index}].producer`}
                    name={`products[${index}].producer`}
                    {...register(`products[${index}].producer`, {
                      required: true,
                    })}
                  >
                    <option
                      value=""
                      defaultValue
                      readOnly
                      className="form-option"
                    >
                      Wybierz
                    </option>
                    {producerOptions}
                  </select>
                  {errors?.products?.[index]?.producer?.message && (
                    <span className="form-error">Podaj nazwę producenta</span>
                  )}
                </label>

                <label
                  htmlFor={`products[${index}].productName`}
                  className="form-label"
                >
                  <div className="form-tooltip-wrapper">
                    Nazwa produktu:<span className="form-star">*</span>{" "}
                    <div
                      className="form-tooltip-btn"
                      data-tip="Prosimy o przepisanie nazwy produktu z faktury lub maila potwierdzającego zamówienie"
                    >
                      i
                    </div>
                    <ReactTooltip className="form-tooltip-component" />
                  </div>
                  <input
                    type="text"
                    className="form-field"
                    id={`products[${index}].productName`}
                    name={`products[${index}].productName`}
                    {...register(`products[${index}].productName`, {
                      required: true,
                    })}
                  />
                  {errors?.products?.[index]?.producer?.message && (
                    <span className="form-error">Podaj nazwę produktu</span>
                  )}
                </label>

                <label
                  htmlFor={`products[${index}].quantity`}
                  className="form-label"
                >
                  Ilość sztuk:<span className="form-star">*</span>
                  <input
                    type="number"
                    className="form-field"
                    id={`products[${index}].quantity`}
                    name={`products[${index}].quantity`}
                    {...register(`products[${index}].quantity`, {
                      required: true,
                    })}
                  />
                  {errors?.products?.[index]?.producer?.message && (
                    <span className="form-error">Podaj nazwę produktu</span>
                  )}
                </label>
              </div>
            </div>
          ))}
          <div className="form__buttons-wrapper">
            <div className="form-btn-wrapper">
              <button
                className="form-btn form-btn--add"
                onClick={() =>
                  append({ productName: "", producer: "", quantity: 1 })
                }
              >
                Dodaj pozycję
              </button>
            </div>
          </div>

          <label htmlFor="rodo" className="form-label">
            <div className="form-checkbox-wrapper">
              <input
                type="checkbox"
                className="form-field-checkbox"
                id="rodo"
                name="rodo"
                {...register("rodo", {
                  required: true,
                })}
              />
              <span className="form-checkbox-text">
                Wyrażam zgodę na przetwarzanie moich danych osobowych przez P.W.
                MULTIMAX Damian Chwiejczak, ul. Peowiaków 9, 22-400 Zamość,
                przetwarzanych do celów związanych z reklamacją lub zwrotem
                towaru.<span className="form-star">*</span>
                {errors.rodo?.message && (
                  <div className="form-error">Zgoda jest wymagana</div>
                )}
              </span>
            </div>
          </label>

          <div className="form-btn-wrapper">
            <button type="submit" className="form-btn form-btn-submit">
              Wyślij formularz
            </button>
          </div>

          <div className="form-footer">
            <div>Klauzula informacyjna RODO:</div>
            Administratorem Państwa danych osobowych jest P.W. MULTIMAX Damian
            Chwiejczak, ul. Peowiaków 9, 22-400 Zamość. Dane osobowe będą
            przetwarzane do celów związanych z reklamacją lub zwrotem towaru.{" "}
            <a
              className="form-footer-link"
              href="https://emultimax.pl/regulaminy/obowiazek-informacyjny-emultimax-zwroty-reklamacje.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Zobacz szczegóły
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
