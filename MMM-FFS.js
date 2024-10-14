Module.register("MMM-FFS", {
  defaults: {
    from: "8575573",  // Stazione di partenza (Mendrisio)
    to: "8505380",    // Stazione di arrivo (Lugano),
    refreshInterval: 5 * 60 * 1000  // Aggiornamento ogni 5 minuti
  },

  start: function() {
    this.sendSocketNotification("GET_CONNECTIONS", {
      from: this.config.from,
      to: this.config.to
    });
    this.trainData = null;

    // Imposta aggiornamento automatico ogni 5 minuti (o il valore specificato)
    const self = this;
    setInterval(function() {
      self.sendSocketNotification("GET_CONNECTIONS", {
        from: self.config.from,
        to: self.config.to
      });
    }, this.config.refreshInterval);
  },

  getStyles: function() {
    return ["MMM-FFS.css"]; // Per aggiungere stili personalizzati
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
      const departureDelay = train.from.delay ? `${train.from.delay} min di ritardo` : "Nessun ritardo";
      const arrivalDelay = train.to.delay ? `${train.to.delay} min di ritardo` : "Nessun ritardo";

      trainInfo.innerHTML = `
        <div class="train-header">
          <strong>${trainName}</strong>
        </div>
        <div class="train-details">
          <div class="station">
            <span class="label">Partenza:</span> ${train.from.station.name} <br>
            <span class="label">Orario:</span> ${departureTime} <br>
            <span class="label">Ritardo:</span> ${departureDelay}
          </div>
          <div class="station">
            <span class="label">Arrivo:</span> ${train.to.station.name} <br>
            <span class="label">Orario:</span> ${arrivalTime} <br>
            <span class="label">Ritardo:</span> ${arrivalDelay}
          </div>
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
