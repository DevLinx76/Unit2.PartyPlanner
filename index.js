// JavaScript File: index.js

const EVENTS_URI =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2308-ACC-PT-WEB-PT-A/events";

const state = {
  events: [],
};

// Fetch and display all parties
const getParties = async () => {
  try {
    const response = await fetch(EVENTS_URI);
    const json = await response.json();
    if (json.error) throw new Error(json.error);
    state.events = json.data;
    renderEvents();
  } catch (error) {
    console.error('GET Error:', error);
  }
};

// Add a new party
const createParty = async (partyData) => {
  try {
    const response = await fetch(EVENTS_URI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partyData),
    });
    const json = await response.json();
    if (json.error) throw new Error(json.error);
    getParties(); // Refresh the list of parties
  } catch (error) {
    console.error('POST Error:', error);
    if (json && json.error) {
      console.error('API Error:', json.error);
    }
  }
};

// Delete a party
const deleteParty = async (id) => {
  try {
    const response = await fetch(`${EVENTS_URI}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error('Delete was not successful');
    getParties(); // Refresh the list of parties
  } catch (error) {
    console.error('DELETE Error:', error);
  }
};

// Update a party
const updateParty = async (id, updatedData) => {
  try {
    const response = await fetch(`${EVENTS_URI}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    const json = await response.json();
    if (json.error) throw new Error(json.error);
    getParties(); // Refresh the list of parties
  } catch (error) {
    console.error('PUT Error:', error);
  }
};

// Event listener for form submission
document.querySelector("#create-party form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const partyData = {
    name: formData.get('title'),
    description: formData.get('description'),
    date: formData.get('date'),
    location: formData.get('location'),
  };
  const partyId = formData.get('id');
  if (partyId) {
    updateParty(partyId, partyData);
  } else {
    createParty(partyData);
  }
  event.target.reset(); // Clear the form
});

// Render all parties to the DOM
const renderEvents = () => {
  const partiesList = document.querySelector("#display-parties");
  partiesList.innerHTML = ''; // Clear the current list
  state.events.forEach(party => {
    const partyElement = document.createElement("li");
    partyElement.innerHTML = `
      <h2>${party.name}</h2>
      <p>${new Date(party.date).toISOString()}</p>
      <p>${party.location}</p>
      <p>${party.description}</p>
      <button onclick="deleteParty(${party.id})">Delete</button>
      <button onclick="populateEditForm(${party.id})">Edit</button>
    `;
    partiesList.appendChild(partyElement);
  });
};

// Populate the edit form with party details
const populateEditForm = (id) => {
  const party = state.events.find(event => event.id === id);
  if (!party) return;
  const form = document.querySelector("#create-party form");
  form.title.value = party.name;
  form.date.value = party.date;
  form.location.value = party.location;
  form.description.value = party.description;
  form.id.value = party.id; // Assuming there is an input field in the form for the id
};

// Initialize the application by fetching the parties
getParties();
