exports.default = {
  type: 'array',
  required: true,
  items: {
    type: 'object',
    properties: {
      in: {
        type: 'string',
        required: true
      },
      out: {
        type: 'string',
        required: true
      }
    }
  }
}
