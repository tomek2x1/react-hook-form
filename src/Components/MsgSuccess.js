const MsgSuccess = () => {
  return (
    <div className="message-wrapper">
      <div className="message-wrapper-container">
        <h2 className="message-wrapper-success">
          Formularz został wysłany poprawnie
        </h2>
        <h3 className="message-wrapper-id">
          Numer Twojego zgłoszenia: <span>{"taskNumber"}</span>
        </h3>
        <p className="message-wrapper-remember">
          * Potwierdzenie wysłania formularza znajdziesz na swojej skrzynce
          pocztowej.
        </p>
        <p className="message-wrapper-remember">
          ** Pamiętaj, aby spakować wszystkie elementy zestawu oraz oznaczyć
          paczkę numerem zgłoszenia.
        </p>
      </div>
    </div>
  );
};

export default MsgSuccess;
