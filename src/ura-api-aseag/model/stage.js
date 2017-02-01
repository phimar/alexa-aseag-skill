class Stage {
  constructor(id, name, lat, lng) {
    this.id = id;
    this.name = name;
    this.pos = [lat, lng];
  }

  static fromJSONArray(json) {
    const [responsType,
      stopPointName,
      stopID,
      lat,
      lng] = json;

    if (responsType === 0) {
      return new Stage(stopID, stopPointName, lat, lng);
    } else {
      return null;
    }
  }

  toObject() {
    return {id: this.id, name: this.name, pos: this.pos};
  }

}

export default Stage;
