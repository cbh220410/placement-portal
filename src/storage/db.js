// src/storage/db.js

export const getTable = (key) => {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const setTable = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const addRow = (key, row) => {
  const table = getTable(key);
  table.push(row);
  setTable(key, table);
};

export const updateRow = (key, id, newData) => {
  const table = getTable(key);
  const updated = table.map((item) =>
    item.id === id ? { ...item, ...newData } : item
  );
  setTable(key, updated);
};

export const deleteRow = (key, id) => {
  const table = getTable(key);
  const updated = table.filter((item) => item.id !== id);
  setTable(key, updated);
};
