class ResponseBuilder {
  created(res, data, message = "Resource created successfully.") {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  success(res, data, message = "Resource retrieved successfully.") {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  deleted(res, message = "Resource deleted successfully.") {
    return res.status(200).json({
      success: true,
      message,
    });
  }

  paginated(res, data, pagination, message = "Resources retrieved successfully.") {
    return res.status(200).json({
      success: true,
      message,
      data: {
        items: data,
        pagination,
      },
    });
  }
}

export default new ResponseBuilder();
