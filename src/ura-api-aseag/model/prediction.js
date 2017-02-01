class Prediction {
  constructor(stopPointIndicator, lineName, estimatedTime, destinationName) {
    this.stopPointIndicator = stopPointIndicator;
    this.lineName = lineName;
    this.estimatedTime = new Date(estimatedTime);
    this.destinationName = destinationName;
  }

  static fromJSONArray(json) {
    const [responseType,
      stopPointIndicator,
      lineName,
      destinationName,
      estimatedTime] = json;

    if (responseType === 1) {
      return new Prediction(stopPointIndicator, lineName, estimatedTime, destinationName);
    } else {
      return null;
    }

  }
}

export default Prediction;
