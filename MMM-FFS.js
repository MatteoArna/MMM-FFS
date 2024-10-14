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
        <div class="train-header">
          <strong>${train.from.station.name} to ${train.to.station.name}</strong>
        </div>
        <div class="train-details">
          <div class="time-section">
            ${departureTime} ${departureDelay ? `<span class="delay">${departureDelay}</span>` : ""}
          </div>
          <div class="time-section">
            ${arrivalTime} ${arrivalDelay ? `<span class="delay">${arrivalDelay}</span>` : ""}
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
