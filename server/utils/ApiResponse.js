class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success(data, message = "Success") {
    return new ApiResponse(200, data, message);
  }

  static created(data, message = "Created Successfully") {
    return new ApiResponse(201, data, message);
  }

  static noContent(message = "Deleted Successfully") {
    return new ApiResponse(204, null, message);
  }

  static paginated(data, pagination, message = "Success") {
    return {
      success: true,
      statusCode: 200,
      message,
      data,
      pagination,
    };
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

module.exports = ApiResponse;
