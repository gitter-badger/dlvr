exports.default = {
  properties: {
    release: {
      properties: {
        assets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                required: true
              },
              name: {
                type: 'string',
                required: true
              }
            }
          }
        },
        draft: {
          required: true,
          type: 'boolean'
        }
      },
      type: 'object',
      required: true
    },
    repo: {
      required: true,
      type: 'string'
    },
    token: {
      required: true,
      type: 'string'
    }
  },
  type: 'object'
};
