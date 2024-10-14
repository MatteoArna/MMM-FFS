Module.register("MMM-FFS", {
  defaults: {
    from: "8575573",  // Stazione di partenza
    to: "8505380",    // Stazione di arrivo
  },

  start: function() {
    this.sendSocketNotification("GET_CONNECTIONS", {
      from: this.config.from,
      to: this.config.to
    });
    this.trainData = null;
  },

  getDom: function() {
    const wrapper = document.createElement("div");
    if (!this.trainData) {
      wrapper.innerHTML = "Caricamento...";
      return wrapper;
    }

    this.trainData.forEach(train => {
      const trainInfo = document.createElement("div");
      const departureTime = new Date(train.from.departure).toLocaleTimeString();
      const arrivalTime = new Date(train.to.arrival).toLocaleTimeString();
      const trainName = train.products[0];
      const departureDelay = train.from.delay ? `${train.from.delay} minuti` : "Nessun ritardo";

      trainInfo.innerHTML = `
        <strong>Treno: ${trainName}</strong><br>
        Da: ${train.from.station.name} (Partenza: ${departureTime}, Ritardo: ${departureDelay})<br>
        A: ${train.to.station.name} (Arrivo: ${arrivalTime})<br>
        -------------------
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
