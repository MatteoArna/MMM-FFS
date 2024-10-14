Module.register("MMM-FFS", {
  defaults: {
    from: "8575573",  // Stazione di partenza
    to: "8505380",    // Stazione di arrivo
    refreshInterval: 5 * 60 * 1000  // Aggiornamento ogni 5 minuti
  },

  start: function() {
    this.sendSocketNotification("GET_CONNECTIONS", {
      from: this.config.from,
      to: this.config.to
    });
    this.trainData = null;

    // Aggiorna i dati ogni 5 minuti
    const self = this;
    setInterval(function() {
      self.sendSocketNotification("GET_CONNECTIONS", {
        from: self.config.from,
        to: self.config.to
      });
    }, this.config.refreshInterval);
  },

  getStyles: function() {
    return ["MMM-FFS.css"]; // Stili personalizzati
  },

 getDom: function() {
  const wrapper = document.createElement("div");
  wrapper.className = "train-wrapper";

  if (!this.trainData) {
    wrapper.innerHTML = "Caricamento...";
    return wrapper;
  }

  this.trainData.forEach(train => {
    const trainInfo = document.createElement("div");
    trainInfo.className = "train-info";

    const departureTime = new Date(train.from.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const arrivalTime = new Date(train.to.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const trainName = train.products[0];
    
    // Gestione dei ritardi
    const departureDelay = train.from.delay ? `+${train.from.delay} min` : "";
    const arrivalDelay = train.to.delay ? `+${train.to.delay} min` : "";

    trainInfo.innerHTML = `
      <div class="train-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-train" viewBox="0 0 16 16">
          <path d="M0 4a4 4 0 1 1 8 0v5.086A1.5 1.5 0 0 0 8.707 10.5H7.793A1.5 1.5 0 0 0 8 11.586V13.5h.5A.5.5 0 0 1 9 14h-.793l-.6 1H2.4l-.6-1H1a.5.5 0 0 1 0-1h.5v-1.914A1.5 1.5 0 0 0 2.207 10.5H1.293A1.5 1.5 0 0 0 2 9.586V4a4 4 0 1 1 8 0v5.086A1.5 1.5 0 0 0 8.707 10.5H7.793A1.5 1.5 0 0 0 8 11.586V13.5h.5A.5.5 0 0 1 9 14h-.793l-.6 1H2.4l-.6-1H1a.5.5 0 0 1 0-1h.5v-1.914A1.5 1.5 0 0 0 2.207 10.5H1.293A1.5 1.5 0 0 0 2 9.586V4a4 4 0 1 1 8 0zM7 12.5H3v-1h4v1z"/>
        </svg>
      </div>
      <div class="train-header">
        <strong>${train.from.station.name} to ${train.to.station.name}</strong>
      </div>
      <div class="train-details">
        <div class="time-section">
          ${departureTime}
        </div>
        <div class="time-section">
          ${arrivalTime}
        </div>
      </div>
      <div class="delay-section">
        <span>${departureDelay ? `<span class="delay">${departureDelay}</span>` : ""}</span>
        <span>${arrivalDelay ? `<span class="delay">${arrivalDelay}</span>` : ""}</span>
      </div>
      <hr>
    `;
    wrapper.appendChild(trainInfo);
  });

  return wrapper;
},


  socketNotificationReceived: function(notification, payload) {
    if (notification === "CONNECTIONS_RESULT") {
      this.trainData = payload;
      this.updateDom();
    } else if (notification === "ERROR") {
      console.error("Errore nella ricezione dei dati: ", payload);
    }
  }
});
