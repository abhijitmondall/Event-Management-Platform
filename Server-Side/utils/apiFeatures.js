class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedQueries = ["page", "sort", "limit", "fields", "text"];
    excludedQueries.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const queryObj = { ...this.queryString };

      const sortBy = queryObj.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const queryObj = { ...this.queryString };
      const fields = queryObj.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const queryObj = { ...this.queryString };
    const limitPerPage = queryObj.limit * 1 || 20;
    const page = queryObj.page * 1 || 1;
    const skips = (page - 1) * limitPerPage;

    this.query = this.query.skip(skips).limit(limitPerPage);

    return this;
  }

  search() {
    if (this.queryString.text) {
      const queryObj = { ...this.queryString };

      console.log(queryObj.text.search);
      this.query = this.query.find({
        name: { $regex: new RegExp(queryObj.text.search, "i") },
      });
    }
    return this;
  }
}

module.exports = ApiFeatures;
