class Sentence {
  constructor(document) {
    const data = document.data();

    this.id = document.id;
    this.text = data.text;
    this.category = data.category;
  }
}

export default Sentence;
