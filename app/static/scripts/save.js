import { fetchJson, sendJson } from "./jsonUtils.js";

export class Save {
  constructor(data) {
    if (data == null) {
      throw new Error("Please use the loadSave() method to make a new save object.");
    }
    this.data = data;
  }

  // Use this to make a constructor.
  static async loadSave() {
    const data = await fetchJson("/getsave");
    return new Save(data);
  }

  async sendSave() {
    // Sends the save json file back to the backend.
    console.log(this.data);
    await sendJson("/updatesave", this.data);
  }
}
