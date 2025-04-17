import { fetchJson } from "./jsonUtils.js";

export class Save {
  constructor(data) {
    this.data = data;
  }

  static async loadSave() {
    const data = await fetchJson("/getsave");
    return new Save(data);
  }
}
