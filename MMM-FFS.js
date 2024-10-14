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

    // Aggiungi un titolo che indichi da dove a dove va il treno
    const title = document.createElement("div");
    title.className = "train-title";

    // Considera il primo treno per mostrare da dove a dove va il treno (puoi adattarlo se mostri più treni)
    const firstTrain = this.trainData[0];
    title.innerHTML = `<h2><b>${firstTrain.from.station.name}</b> to <b>${firstTrain.to.station.name}</b></h2>`;
    wrapper.appendChild(title);

    this.trainData.forEach(train => {
      const trainInfo = document.createElement("div");
      trainInfo.className = "train-info";

      const departureTime = new Date(train.from.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const arrivalTime = new Date(train.to.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const trainName = train.products[0];
      const departureDelay = train.from.delay ? `<i class="delay">+ ${train.from.delay}</i>` : "";
      const arrivalDelay = train.to.delay ? `<i class="delay">+ ${train.to.delay}</i>` : "";

      trainInfo.innerHTML = `
        <div class="train-name">
            <strong>${trainName}</strong>
        </div>
        <div class="schedules">
            ${departureTime} ${departureDelay} ------> ${arrivalTime} ${arrivalDelay}
        </div>
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
