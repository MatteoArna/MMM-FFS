const NodeHelper = require("node_helper");
const axios = require('axios');

const endpoint = "http://transport.opendata.ch/v1";

module.exports = NodeHelper.create({
  start: function() {
    console.log("Starting module helper: " + this.name);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === 'GET_CONNECTIONS') {
      this.getConnections(payload.from, payload.to);
    }
  },

  getConnections: async function(from, to) {
    try {
      const response = await axios.get(`${endpoint}/connections?from=${from}&to=${to}`);
      this.sendSocketNotification("CONNECTIONS_RESULT", response.data.connections);
    } catch (error) {
      console.error("Error fetching connections: ", error);
      this.sendSocketNotification("ERROR", error.message);
    }
  }
});
